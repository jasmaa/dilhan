package com.jasmaa.graphtool;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import javafx.animation.KeyFrame;
import javafx.animation.Timeline;
import javafx.application.Application;
import javafx.scene.Group;
import javafx.scene.Scene;
import javafx.scene.paint.Color;
import javafx.stage.Stage;
import javafx.util.Duration;
import javafx.scene.canvas.*;
import javafx.scene.input.KeyCode;
import javafx.scene.input.MouseButton;

public class GraphToolDriver extends Application {
	Canvas canvas;
	GraphicsContext gc;
	List<GraphNode> graphNodes;
	
	boolean wasDragging;
	List<GraphNode> selectedNodes = new ArrayList<GraphNode>();
	
	public static void main(String[] args) {
        launch(args);
    }
    
    @Override
    public void start(Stage pStage) {
        
    	Group root = new Group();
    	Scene s = new Scene(root, 500, 500, Color.GRAY);
    	
    	GraphNode node1 = new GraphNode(0, 0);
    	GraphNode node2 = new GraphNode(100, 100);
    	GraphNode node3 = new GraphNode(100, 50);
    	GraphNode node4 = new GraphNode(60, 30);
    	
    	graphNodes = new ArrayList<GraphNode>();
		graphNodes.add(node1);
		graphNodes.add(node2);
		graphNodes.add(node3);
		graphNodes.add(node4);
    	
		// Update screen
		Timeline timeline = new Timeline();
        timeline.setCycleCount(Timeline.INDEFINITE);
        timeline.getKeyFrames().add(
                new KeyFrame(Duration.millis(1),e->{
                	gc.clearRect(0, 0, 500, 500);
            		
                	// Draw edges
                	gc.setStroke(Color.TURQUOISE);
                	gc.setLineWidth(5);
                	for(GraphNode n : graphNodes){
                		Collections.sort(n.neighbors);
                		int counter = 0;
                		
                		for(int i=0; i<n.neighbors.size(); i++){
                			
                			GraphNode neighbor = n.neighbors.get(i);
                			
                			if(i >= 1 && n.neighbors.get(i-1) == n.neighbors.get(i)){
                				counter++;
                			}
                			else{
                				counter = 0;
                			}
                			
                			gc.beginPath();
                			gc.moveTo(n.x+15, n.y+15);
                			double[] controlPt = CalcControlPt(n.x+15, n.y+15, neighbor.x+15, neighbor.y+15, counter);
                			gc.quadraticCurveTo(controlPt[0], controlPt[1], neighbor.x+15, neighbor.y+15);
                			
                			gc.stroke();
                		}
                	}
                	
                	// Draw nodes
                	for(GraphNode n : graphNodes){
                		if(n.selected){
                			gc.setFill(Color.RED);
                		}
                		else{
                			gc.setFill(Color.WHITE);
                		}
                		gc.fillOval(n.getX(), n.getY(), 30, 30);
                		
                	}
                }));
        timeline.playFromStart();
		
		// Set up canvas
    	canvas = new Canvas(500,500);
    	
    	// Canvas events
    	canvas.setOnMouseDragged(e->{
    		for(GraphNode n : graphNodes){
        		if(Math.abs(e.getSceneX()-15-n.getX()) < 15 && Math.abs(e.getSceneY()-15-n.getY()) < 15){
        			n.setX(e.getSceneX()-15);
        			n.setY(e.getSceneY()-15);
        			break;
        		}
        	}
    		
    		wasDragging = true;
    	});
    	canvas.setOnMouseClicked(e->{
    		
    		if(wasDragging){
    			wasDragging = false;
    			return;
    		}
    		
    		// Select node
    		if(e.getButton() == MouseButton.PRIMARY){
	    		for(GraphNode n : graphNodes){
	        		if(Math.abs(e.getSceneX()-15-n.getX()) < 15 && Math.abs(e.getSceneY()-15-n.getY()) < 15){
	        			if(n.selected){
	        				n.selected = false;
	        			}
	        			else if(selectedNodes.size() < 2){
	        				n.selected = true;
	        			}
	        			break;
	        		}
	        	}
	    		
	    		// count selected
	    		selectedNodes.clear();
	    		for(GraphNode n : graphNodes){
	    			if(n.selected){
	    				selectedNodes.add(n);
	    			}
	    		}
    		}
    		
    		// Create node
    		else if(e.getButton() == MouseButton.SECONDARY){
    			GraphNode node = new GraphNode(e.getSceneX()-15, e.getSceneY()-15);
    			graphNodes.add(node);
    		}
    	});
    	s.setOnKeyPressed(e->{
    		if(e.getCode() == KeyCode.N){
    			if(selectedNodes.size() == 2){
    				selectedNodes.get(0).neighbors.add(selectedNodes.get(1));
    			}
    		}
    		else if(e.getCode() == KeyCode.D){
    			if(selectedNodes.size() == 2){
    				if(selectedNodes.get(0).neighbors.contains(selectedNodes.get(1))){
    					selectedNodes.get(0).neighbors.remove(selectedNodes.get(1));
    					
    				}
    				else if(selectedNodes.get(1).neighbors.contains(selectedNodes.get(0))){
    					selectedNodes.get(1).neighbors.remove(selectedNodes.get(0));
    					
    				}
    			}
    		}
    		else if(e.getCode() == KeyCode.A){
    			if(selectedNodes.size() == 2){
    				selectedNodes.get(0).selected = false;
    				selectedNodes.get(1).selected = false;
    				selectedNodes.clear();
    			}
			}
    	});
    	
    	
    	gc = canvas.getGraphicsContext2D();
    	root.getChildren().add(canvas);
    	
        pStage.setScene(s);
        pStage.setTitle("Dilhan");
        pStage.show();
    }
    
    double[] CalcControlPt(double x1, double y1, double x2, double y2, int n){
    	double midX = (x1+x2)/2;
    	double midY = (y1+y2)/2;
    	double orthoSlope = -(x1-x2) / (y1-y2);
    	
    	double size = Math.pow(-1, n) * 30* ((n+1)/2);
    	
    	// preserve n length
    	double w = size / Math.sqrt(1+Math.pow(orthoSlope, 2));
    	double h = orthoSlope*w;
    	
    	double[] res = {midX+w, midY+h};
    	
    	return res;
    }
}