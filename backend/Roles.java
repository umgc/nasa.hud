/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.example.demo;

import java.util.*;
/**
 *
 * @author jonathan
 */
public class Roles extends KeyActors{
    List<Role> roles;
    
    public void setRole(List<Role> roles){
        this.roles = roles;
    }
    
    public List<Role> getRolesList(){
        return roles;
    }
}
