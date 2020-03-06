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
 * @author jonathan
 */
public class Tasks{
    
    String title;
    List<String> file;
    List<Role> roles;
    List<Steps> steps;
    
    public void setTitle(String title){
        this.title = title;
    }
    
    public void setFileList(List<String> file){
        this.file = file;
    }
    
    public void setRoles(List<Role> roles){
        this.roles = roles;
    }
    
    public void setSteps(List<Steps> steps){
        this.steps = steps;
    }
    
    public String getTitle(){
        return title;
    }
    
    public List<String> getFileList(){
        return file;
    }
    
    public List<Role> getRoles(){
        return roles;
    }
        
    public List<Steps> getSteps(){
        return steps;
    }
    
}