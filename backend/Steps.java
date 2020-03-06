/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.example.demo;

import java.util.*;
/**
 *NEEDS WORK
 * @author jonathan
 */

public class Steps {
    
    String title;
    List<String> substeps;
    float duration;
    List<KeyActors> actors;
    String pictureURL;
    String warning;
    String caution;
    List<String> path; 
    String text;
    String checkboxes;
    
    public void setDescription(String title){
        this.title = title;
    }
    
    public void setSubSteps(List<String> substeps){
        this.substeps = substeps;
    }
    
    public void setDuration(float duration){
        this.duration = duration;
    }
    
    public void setKeyActors(List<KeyActors> actors){
        this.actors = actors;
    }
    
    public void setPicturesURL(String pictureURL){
        this.pictureURL = pictureURL;
    }
    
    public void setWarning(String warning){
        this.warning = warning;
    }
    
    public void setCaution(String caution){
        this.caution = caution;
    }
    public void setImageList(List<String> path){
        this.path = path;
    }
    
    public String getDescription(){
        return title;
    }
    
    public List<String> getSubSteps(){
        return substeps;
    }
    
    public float getDuration(){
        return duration;
    }
    
    public List<KeyActors> getStepActors(){
        return actors;
    }
    
    public String getPicturesURL(){
        return pictureURL;
    }
    
    public String getWarning(){
        return warning;
    }
    
    public String getCaution(){
        return caution;
    }
}


