package com.jasmaa.graphtool;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import javafx.scene.input.KeyCode;
import javafx.scene.input.MouseButton;
import javafx.stage.FileChooser;
import javafx.stage.FileChooser.ExtensionFilter;
import javafx.stage.Stage;

enum EditorState {
	DRAGGING, GRABBING, IDLE;
}

/**
 * Controls user interaction with graphing UI
 * 
 * @author Jason Maa
 *
 */
public class GraphingEngine {
	EditorState state;

	List<GraphNode> graphNodes;
	List<GraphEdge> graphEdges;

	List<GraphNode> selectedNodes = new ArrayList<GraphNode>();
	GraphNode selectedNode;
	double oldXPos;
	double oldYPos;

	int numEdges;
	int numVerts;

	File currentFile;

	public GraphingEngine() {
		graphNodes = new ArrayList<GraphNode>();
		graphEdges = new ArrayList<GraphEdge>();
	}

	public void initDrag(double x, double y) {
		for (GraphNode n : graphNodes) {
			if (Math.abs(x - 15 - n.getX()) < 30 && Math.abs(y - 45 - n.getY()) < 30) {
				selectedNode = n;
				break;
			}
		}

		state = EditorState.DRAGGING;
	}

	public void endDrag() {
		selectedNode = null;
		// System.out.println("drag exit");
	}

	public void drag(double x, double y) {
		if (selectedNode != null) {
			selectedNode.setX(x - 15);
			selectedNode.setY(y - 45);
		}
	}

	public void mouseClick(MouseButton button, double x, double y) {
		if (state != EditorState.IDLE) {
			if (state == EditorState.GRABBING) {
				deselectAll();
			}
			state = EditorState.IDLE;
			return;
		}

		// Select node
		if (button == MouseButton.PRIMARY) {
			for (GraphNode n : graphNodes) {
				if (Math.abs(x - 15 - n.getX()) < 30 && Math.abs(y - 45 - n.getY()) < 30) {
					if (n.selected) {
						n.selected = false;
					} else {
						n.selected = true;
					}
					break;
				}
			}

			// count selected
			selectedNodes.clear();
			for (GraphNode n : graphNodes) {
				if (n.selected) {
					selectedNodes.add(n);
				}
			}
		}

		// Node addition
		else if (button == MouseButton.SECONDARY) {
			GraphNode node = new GraphNode(x - 15, y - 45);
			graphNodes.add(node);
		}
	}

	public void mouseMove(double x, double y) {
		// Do Grab
		if (state == EditorState.GRABBING) {
			for (GraphNode n : selectedNodes) {
				n.x += x - oldXPos;
				n.y += y - oldYPos;
			}
		}

		oldXPos = x;
		oldYPos = y;
	}

	public void keyPress(KeyCode code) {
		// Edge addition
		if (code == KeyCode.F) {
			if (selectedNodes.size() == 2) {
				selectedNodes.get(0).neighbors.add(selectedNodes.get(1));
				selectedNodes.get(1).neighbors.add(selectedNodes.get(0));

				graphEdges.add(new GraphEdge(selectedNodes.get(0), selectedNodes.get(1)));

				deselectAll();
			}
		}

		// Edge deletion
		else if (code == KeyCode.D) {
			if (selectedNodes.size() == 2) {
				if (selectedNodes.get(0).neighbors.contains(selectedNodes.get(1))) {
					selectedNodes.get(0).neighbors.remove(selectedNodes.get(1));
				}
				if (selectedNodes.get(1).neighbors.contains(selectedNodes.get(0))) {
					selectedNodes.get(1).neighbors.remove(selectedNodes.get(0));
				}

				// Add edge deletion here
				GraphEdge testEdge = new GraphEdge(selectedNodes.get(0), selectedNodes.get(1));
				for (GraphEdge edge : graphEdges) {
					if (testEdge.hashCode() == edge.hashCode()) {
						graphEdges.remove(edge);
						break;
					}
				}

				deselectAll();
			}
		}

		// Select all
		else if (code == KeyCode.A) {
			if (selectedNodes.size() < graphNodes.size()) {
				selectAll();
			} else {
				deselectAll();
			}
		}

		// Node deletion
		else if (code == KeyCode.DELETE) {
			for (int i = 0; i < graphNodes.size(); i++) {

				GraphNode n = graphNodes.get(i);

				if (n.selected) {
					graphNodes.remove(n);

					for (GraphNode node : graphNodes) {
						for (int j = 0; j < node.neighbors.size(); j++) {
							if (node.neighbors.get(j) == n) {
								node.neighbors.remove(j);
								j--;
							}
						}
					}

					for (int j = 0; j < graphEdges.size(); j++) {
						GraphEdge edge = graphEdges.get(j);
						if (edge.contains(n)) {
							graphEdges.remove(edge);
							j--;
						}
					}

					i--;
				}

			}
		}

		// Activate Grab
		else if (code == KeyCode.G) {
			state = EditorState.GRABBING;
		}
	}

	public static double[] CalcControlPt(double x1, double y1, double x2, double y2, int n) {
		double midX = (x1 + x2) / 2;
		double midY = (y1 + y2) / 2;
		double orthoSlope = -(x1 - x2) / (y1 - y2);

		double size = Math.pow(-1, n) * 30 * ((n + 1) / 2);

		// preserve n length
		double w = size / Math.sqrt(1 + Math.pow(orthoSlope, 2));
		double h = orthoSlope * w;

		double[] res = { midX + w, midY + h };

		return res;
	}

	void deselectAll() {
		for (int i = 0; i < selectedNodes.size(); i++) {
			selectedNodes.get(i).selected = false;
		}
		selectedNodes.clear();
	}

	void selectAll() {
		for (int i = 0; i < graphNodes.size(); i++) {
			graphNodes.get(i).selected = true;
			selectedNodes.add(graphNodes.get(i));
		}
	}

	void saveAs(Stage stage) {
		FileChooser fileChooser = new FileChooser();
		fileChooser.getExtensionFilters().add(new FileChooser.ExtensionFilter("DLH", "*.dlh"));
		File file = fileChooser.showSaveDialog(stage);
		if (file == null) {
			return;
		}

		saveData(stage, file);
	}

	void save(Stage stage) {
		if (currentFile == null) {
			saveAs(stage);
		} else {
			saveData(stage, currentFile);
		}
	}

	void saveData(Stage stage, File f) {

		FileOutputStream fileOut;
		ObjectOutputStream out;

		currentFile = f;

		try {

			fileOut = new FileOutputStream(f);
			out = new ObjectOutputStream(fileOut);
			out.writeObject(graphNodes);
			out.close();
			fileOut.close();
			System.out.printf("Saved graph nodes");
		} catch (IOException i) {
			i.printStackTrace();
		}
	}

	void load(Stage stage) {

		FileInputStream fileIn;
		ObjectInputStream in;
		FileChooser fileChooser = new FileChooser();
		fileChooser.getExtensionFilters().add(new FileChooser.ExtensionFilter("DLH", "*.dlh"));
		
		File file = fileChooser.showOpenDialog(stage);
		if (file == null) {
			return;
		}

		currentFile = file;

		try {
			fileIn = new FileInputStream(file);
			in = new ObjectInputStream(fileIn);
			graphNodes = (List<GraphNode>) in.readObject();
			in.close();
			fileIn.close();
		} catch (IOException i) {
			i.printStackTrace();
			return;
		} catch (ClassNotFoundException c) {
			System.out.println("Class not found");
			c.printStackTrace();
			return;
		}

		for (GraphNode n : graphNodes) {
			n.selected = false;
		}

		// Build edges from adjacency
		graphEdges.clear();
		for (GraphNode n : graphNodes) {
			for (GraphNode neighbor : n.neighbors) {
				GraphEdge edge = new GraphEdge(n, neighbor);
				graphEdges.add(edge);
			}
		}
		// Delete repeated
		Collections.sort(graphEdges);
		for (int i = 0; i < graphEdges.size(); i++) {
			graphEdges.remove(i);
		}
	}
}
