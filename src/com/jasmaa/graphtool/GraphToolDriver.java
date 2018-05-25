package com.jasmaa.graphtool;

import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import javafx.animation.KeyFrame;
import javafx.animation.Timeline;
import javafx.application.Application;
import javafx.beans.value.ChangeListener;
import javafx.beans.value.ObservableValue;
import javafx.collections.FXCollections;
import javafx.geometry.Pos;
import javafx.scene.Scene;
import javafx.scene.paint.Color;
import javafx.stage.Stage;
import javafx.util.Duration;
import javafx.scene.canvas.*;
import javafx.scene.control.Button;
import javafx.scene.control.ChoiceBox;
import javafx.scene.control.Label;
import javafx.scene.control.Menu;
import javafx.scene.control.MenuBar;
import javafx.scene.control.MenuItem;
import javafx.scene.control.ToolBar;
import javafx.scene.input.KeyCode;
import javafx.scene.input.MouseButton;
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
    		engine.InitDrag(e.getSceneX(), e.getSceneY());
    		DrawGraph();
    	});
    	canvas.setOnMouseReleased(e->{
    		engine.EndDrag();
    		DrawGraph();
    	});
    	canvas.setOnMouseDragged(e->{
    		engine.Drag(e.getSceneX(), e.getSceneY());
    		DrawGraph();
    	});
    	canvas.setOnMouseClicked(e->{
    		engine.MouseClick(e.getButton(), e.getSceneX(), e.getSceneY());
    		DrawGraph();
    	});
    	canvas.setOnMouseMoved(e->{
    		engine.MouseMove(e.getSceneX(), e.getSceneY());
    		DrawGraph();
    	});
    	
    	s.setOnKeyPressed(e->{
    		engine.KeyPress(e.getCode());
    		DrawGraph();
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
    		 engine.Load(pStage);
    		 if(engine.currentFile != null){
    			 pStage.setTitle(name + " - " + engine.currentFile.getPath());
    		 }
    	});
    	MenuItem saveOption = new MenuItem("Save");
    	saveOption.setOnAction(e->{
    		engine.Save(pStage);
    		if(engine.currentFile != null){
   			 pStage.setTitle(name + " - " + engine.currentFile.getPath());
   		 }
    	});
    	MenuItem saveAsOption = new MenuItem("Save As...");
    	saveAsOption.setOnAction(e->{
    		engine.SaveAs(pStage);
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
        pStage.setResizable(false);
        pStage.show();
    }
    
    void DrawGraph(){
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