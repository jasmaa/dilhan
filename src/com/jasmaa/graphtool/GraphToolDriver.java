package com.jasmaa.graphtool;

import java.awt.Dimension;
import java.awt.Toolkit;
import java.util.ArrayList;
import java.util.List;

import javafx.animation.KeyFrame;
import javafx.animation.Timeline;
import javafx.application.Application;
import javafx.event.ActionEvent;
import javafx.event.EventHandler;
import javafx.scene.Group;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.layout.StackPane;
import javafx.scene.paint.Color;
import javafx.stage.Stage;
import javafx.util.Duration;
import javafx.scene.canvas.*;

public class GraphToolDriver extends Application {
	Canvas canvas;
	GraphicsContext gc;
	List<GraphNode> graphNodes;
	
	boolean wasDragging;
	
	public static void main(String[] args) {
        launch(args);
    }
    
    @Override
    public void start(Stage pStage) {
        
    	Group root = new Group();
    	
    	graphNodes = new ArrayList<GraphNode>();
		graphNodes.add(new GraphNode(0, 0));
		graphNodes.add(new GraphNode(100, 100));
		graphNodes.add(new GraphNode(100, 50));
		graphNodes.add(new GraphNode(60, 30));
    	
		// Update screen
		Timeline timeline = new Timeline();
        timeline.setCycleCount(Timeline.INDEFINITE);
        timeline.getKeyFrames().add(
                new KeyFrame(Duration.millis(1),e->{
                	gc.clearRect(0, 0, 500, 500);
            		
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
    		
    		for(GraphNode n : graphNodes){
        		if(Math.abs(e.getSceneX()-15-n.getX()) < 15 && Math.abs(e.getSceneY()-15-n.getY()) < 15){
        			n.selected = !n.selected;
        			break;
        		}
        	}
    	});
    	
    	gc = canvas.getGraphicsContext2D();
    	for(GraphNode n : graphNodes){
    		gc.setFill(Color.WHITE);
    		gc.fillOval(n.getX(), n.getY(), 30, 30);
    	}
    	 
    	root.getChildren().add(canvas);
    	
    	Scene s = new Scene(root, 500, 500, Color.GREEN);
        pStage.setScene(s);
        pStage.show();
    }
}