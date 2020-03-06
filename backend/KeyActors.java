/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.example.demo;

/**
 *
 * @author jonathan
 */
public class KeyActors {
    
    String key;
    String actors;
    String display;
    
    public void setActorKey(String key){
        this.key = key;
    }
    
    public void setIdentifier(String actors){
        this.actors = actors;
    }
    
    public void setScreenName(String display){
        this.display = display;
    }
    
    public String getKey(){
        return key;
    }
        
    public String getScreenName(){
        return display;
    }
    
    public String getIdentifier(){
        return actors;
    }
}
