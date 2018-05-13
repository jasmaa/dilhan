package com.jasmaa.graphtool;

import java.util.List;

public class GraphNode {
	
	double x;
	double y;
	boolean selected;
	public List<GraphNode> neighbors;
	
	public GraphNode(float x, float y){
		this.x = x;
		this.y = y;
	}
	
	public double getX() {
		return x;
	}

	public double getY() {
		return y;
	}

	public void setX(double x) {
		this.x = x;
	}

	public void setY(double y) {
		this.y = y;
	}
	

}
