package com.ManagementProject.demoManagementProject.Models;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Document(collection = "rooms")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Room {
    @Id
        private String id;
        private String roomId;
        private String roomName;
        private String userEmail;
        private List<Message> messages= new ArrayList<>();
        private List<String> members= new ArrayList<>();
    public void addMember(String userEmail) {
        this.members.add(userEmail); // Thêm thành viên vào danh sách
    }
}