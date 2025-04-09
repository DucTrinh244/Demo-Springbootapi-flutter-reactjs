package com.ManagementProject.demoManagementProject.Controllers;


import com.ManagementProject.demoManagementProject.Models.Message;
import com.ManagementProject.demoManagementProject.Models.Room;
import com.ManagementProject.demoManagementProject.Payload.Request.MessageRequest;
import com.ManagementProject.demoManagementProject.Repositories.RoomRepository;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;

import java.time.LocalDateTime;

@Controller
public class ChatController {
    private RoomRepository roomRepository;

    public ChatController(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }

    // for sending and receiving messages
    @MessageMapping("/sendMessage/{roomId}") // chat/sendMessage/{roomId}
    @SendTo("/topic/room/{roomId}")// subscribe to this topic
    public Message sendMessage(
            @DestinationVariable String roomId,
            @RequestBody MessageRequest request
    ) {

        Room room = roomRepository.findByRoomId(request.getRoomId());

        Message message= new Message();
        message.setContent(request.getContent());
        message.setSender(request.getSender());
        message.setTimeStamp(LocalDateTime.now());

        if(room != null) {
            room.getMessages().add(message);
            roomRepository.save(room);
        } else {
            throw  new RuntimeException("Room not found");
        }
        return message;
    }
}
