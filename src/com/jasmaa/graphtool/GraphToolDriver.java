package com.jasmaa.graphtool;

import java.util.Collections;

import javafx.application.Application;
import javafx.geometry.Pos;
import javafx.scene.Scene;
import javafx.scene.paint.Color;
import javafx.stage.Stage;
import javafx.scene.canvas.*;
import javafx.scene.control.Label;
import javafx.scene.control.Menu;
import javafx.scene.control.MenuBar;
import javafx.scene.control.MenuItem;
import javafx.scene.image.Image;
import javafx.scene.layout.VBox;


/**
 * Driver running program
 * 
 * @author Jason Maa
 *
 */
public class GraphToolDriver extends Application {
	
	String prgName = "Dilhan";
	String version = "1.0";
	
	String name = prgName + " v" + version;
	
	Canvas canvas;
	GraphicsContext gc;
	Label infoLabel = new Label();
	MenuBar toolbar = new MenuBar();
	
	GraphingEngine engine;
	
	public static void main(String[] args) {
        launch(args);
        
    }
    
    @Override
    public void start(Stage pStage) {
        
    	engine = new GraphingEngine();
    	
    	VBox root = new VBox();
    	Scene s = new Scene(root, 800, 800, Color.GRAY);
    	
		// Update screen
    	/*
		Timeline timeline = new Timeline();
        timeline.setCycleCount(Timeline.INDEFINITE);
        timeline.getKeyFrames().add(
                new KeyFrame(Duration.millis(1),e->{
                	
                	
                	
                }));
        timeline.playFromStart();
		*/
		
		// Set up canvas
    	canvas = new Canvas(800,600);
    	
    	// Canvas events
    	canvas.setOnDragDetected(e->{
    		engine.initDrag(e.getSceneX(), e.getSceneY());
    		drawGraph();
    	});
    	canvas.setOnMouseReleased(e->{
    		engine.endDrag();
    		drawGraph();
    	});
    	canvas.setOnMouseDragged(e->{
    		engine.drag(e.getSceneX(), e.getSceneY());
    		drawGraph();
    	});
    	canvas.setOnMouseClicked(e->{
    		engine.mouseClick(e.getButton(), e.getSceneX(), e.getSceneY());
    		drawGraph();
    	});
    	canvas.setOnMouseMoved(e->{
    		engine.mouseMove(e.getSceneX(), e.getSceneY());
    		drawGraph();
    	});
    	
    	s.setOnKeyPressed(e->{
    		engine.keyPress(e.getCode());
    		drawGraph();
    	});
    	
    	gc = canvas.getGraphicsContext2D();
    	
    	// Toolbar
    	Menu fileMenu = new Menu("File");
    	MenuItem newOption = new MenuItem("New");
    	newOption.setOnAction(e->{
    		 engine.graphEdges.clear();
    		 engine.graphNodes.clear();
    	});
    	MenuItem loadOption = new MenuItem("Open...");
    	loadOption.setOnAction(e->{
    		 engine.load(pStage);
    		 if(engine.currentFile != null){
    			 pStage.setTitle(name + " - " + engine.currentFile.getPath());
    		 }
    	});
    	MenuItem saveOption = new MenuItem("Save");
    	saveOption.setOnAction(e->{
    		engine.save(pStage);
    		if(engine.currentFile != null){
   			 pStage.setTitle(name + " - " + engine.currentFile.getPath());
   		 }
    	});
    	MenuItem saveAsOption = new MenuItem("Save As...");
    	saveAsOption.setOnAction(e->{
    		engine.saveAs(pStage);
    		if(engine.currentFile != null){
   			 pStage.setTitle(name + " - " + engine.currentFile.getPath());
   		 }
    	});
    	fileMenu.getItems().addAll(newOption, loadOption, saveOption, saveAsOption);
    	
    	Menu optionMenu = new Menu("Options");
    	
    	toolbar.getMenus().addAll(fileMenu);
    	
    	root.getChildren().addAll(toolbar, canvas, infoLabel);
    	root.setAlignment(Pos.BASELINE_CENTER);
    	
        pStage.setScene(s);
        pStage.setTitle(name);
        pStage.setResizable(false); //TODO: Make this work with different resolutions?
        pStage.getIcons().add(new Image("logo.png"));
        pStage.show();
    }
    
    /**
     * Renders graph
     */
    void drawGraph(){
    	gc.clearRect(0, 0, 800, 800);
    	
    	gc.setFill(Color.GRAY);
    	gc.fillRect(0, 0, 800, 800);
    	
    	// Draw edges
    	gc.setStroke(Color.TURQUOISE);
    	gc.setLineWidth(3);
    	Collections.sort(engine.graphEdges);
    	int counter = 0;
    	for(int i=0; i<engine.graphEdges.size(); i++){
    		
    		if(i > 0 && engine.graphEdges.get(i-1).hashCode() == engine.graphEdges.get(i).hashCode()){
    			counter++;
    		}
    		else{
    			counter = 0;
    		}
    		
    		GraphEdge edge = engine.graphEdges.get(i);
    		
    		gc.beginPath();
			gc.moveTo(edge.node1.x+15, edge.node1.y+15);
			double[] controlPt = GraphingEngine.CalcControlPt(edge.node1.x+15, edge.node1.y+15, edge.node2.x+15, edge.node2.y+15, counter);
			gc.quadraticCurveTo(controlPt[0], controlPt[1], edge.node2.x+15, edge.node2.y+15);
			
			gc.stroke();
    	}
    	
    	// Draw nodes
    	for(GraphNode n : engine.graphNodes){
    		if(n.selected){
    			gc.setFill(Color.RED);
    		}
    		else{
    			gc.setFill(Color.WHITE);
    		}
    		gc.fillOval(n.getX(), n.getY(), 30, 30);
    		
    	}
    	
    	// Calculate info
    	infoLabel.setText(	"Vertices: " + engine.graphNodes.size()+
    						"\tEdges: " + engine.graphEdges.size());
    }
    
}