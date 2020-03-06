/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.example.demo;

import java.util.*;
import java.io.*;

/**
 *
 * @author Jonathan
 */
public class Procedure {

    String procedure_name;
    List<KeyActors> actors;
    List<Tasks> tasks;
    
    public Procedure(){
        actors = new ArrayList<KeyActors>();
        tasks = new ArrayList<Tasks>();
    }
    
    public void setProcedure(String procedure_name){
        this.procedure_name = procedure_name;
    }
        
    public String getProcedureName(){
       return procedure_name;
    }
    
    public String getActorName(String actor){
        String nameOfActor = "";
        for(int x = 0; x < actors.size(); x++){
            if(actors.get(x).toString().equals(actor))
                nameOfActor = actor;
            else
                break;
                
        }
        return actor;
    }
    
    public List<KeyActors> getActorList(){
        return actors;
    }
    
     public String getTaskName(String task){
        String nameOfTask = "";
        for(int x = 0; x < tasks.size(); x++){
            if(tasks.get(x).toString().equals(task))
                nameOfTask = task;
            else
                break;
                
        }
        return nameOfTask;
    }
    
    
   
    
}
