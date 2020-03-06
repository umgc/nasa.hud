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
public class Role {
    
    String name;
    float minutes;
    String description;
    
    public void setRoleName(String name){
        this.name = name;
    }
    
    public void setDuration(float minutes){
        this.minutes = minutes;
    }
    
    public void setRoleDescription(String description){
        this.description = description;
    }
    
    public String getRoleName(){
        return name;
    }
    
    public float getDuration(){
        return minutes;
    }
    
    public String getRoleDescription(){
        return description;
    }
}
