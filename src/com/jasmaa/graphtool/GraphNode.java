package com.jasmaa.graphtool;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

/**
 * Stores node info
 * 
 * @author Jason Maa
 *
 */
public class GraphNode implements Comparable<GraphNode>, Serializable{
	
	double x;
	double y;
	boolean selected;
	public List<GraphNode> neighbors;
	
	public GraphNode(double d, double e){
		this.x = d;
		this.y = e;
		neighbors = new ArrayList<GraphNode>();
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

	@Override
	public int compareTo(GraphNode o) {
		if(o.x < this.x){
			return -1;
		}
		else if(o.x > this.x){
			return 1;
		}
		else if(o.y < this.y){
			return -1;
		}
		else if(o.y > this.y){
			return 1;
		}
		else{
			return 0;
		}
	}
	

}
