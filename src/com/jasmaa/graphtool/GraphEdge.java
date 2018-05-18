package com.jasmaa.graphtool;

import java.io.Serializable;
import java.util.Objects;

/**
 * Stores edge info
 * 
 * @author Jason Maa
 *
 */
public class GraphEdge implements Comparable<GraphEdge>, Serializable {
	
	GraphNode node1;
	GraphNode node2;
	
	public GraphEdge (GraphNode n1, GraphNode n2){
		node1 = n1;
		node2 = n2;
	}
	
	public boolean equals(GraphEdge e){
		return node1==e.node1 && node2==e.node2 ||  node2==e.node1 && node1==e.node2;
	}

	public boolean contains(GraphNode n){
		return node1 == n || node2 == n;
	}
	
	@Override
	public int hashCode(){
		return Objects.hash(node1) + Objects.hash(node2);
	}

	@Override
	public int compareTo(GraphEdge o) {
		return hashCode() - o.hashCode();
	}
	
	
}
