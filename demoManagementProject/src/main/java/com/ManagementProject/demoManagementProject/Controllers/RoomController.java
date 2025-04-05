package com.ManagementProject.demoManagementProject.Controllers;


import com.ManagementProject.demoManagementProject.Models.Message;
import com.ManagementProject.demoManagementProject.Models.Room;
import com.ManagementProject.demoManagementProject.Models.User;
import com.ManagementProject.demoManagementProject.Payload.Request.RoomRequest;
import com.ManagementProject.demoManagementProject.Repositories.RoomRepository;
import com.ManagementProject.demoManagementProject.Repositories.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/rooms")
@CrossOrigin("http://localhost:5173")
public class RoomController {
    private RoomRepository roomRepository;
    private UserRepository userRepository;

    public RoomController(RoomRepository roomRepository,UserRepository userRepository) {
        this.roomRepository = roomRepository;
        this.userRepository = userRepository;
    }

    // create room

    @PostMapping
    public ResponseEntity<?> createRoom(@RequestBody RoomRequest roomRequest) {
        String roomName = roomRequest.getRoomName();
        String userEmail = roomRequest.getUserEmail();


        User user = userRepository.findByEmail(userEmail); // hoặc findById(userId).orElse(null)
        if (user == null) {
            return ResponseEntity.badRequest().body("User not found");
        }

        // Tạo room
        Room room = new Room();
        room.setRoomName(roomName);
        room.setUserEmail(userEmail);
        room.setMembers(Collections.singletonList(userEmail));
        Room savedRoom = roomRepository.save(room);

        String updatedRoomId = savedRoom.getId()+"_"+roomName;
        savedRoom.setRoomId(updatedRoomId);
        Room updatedRoom = roomRepository.save(savedRoom); // Lưu lại lần nữa

        return ResponseEntity.status(HttpStatus.CREATED).body(updatedRoom);
    }



    // join rooms

    @GetMapping("/{roomId}")
    public ResponseEntity<?> joinRooms(@PathVariable String roomId, @RequestParam String userEmail) {
        Room room = roomRepository.findByRoomId(roomId);

        if (room == null) {
            return ResponseEntity.badRequest().body("Room not found");
        }
        if (!room.getMembers().contains(userEmail)) {
            room.addMember(userEmail); // Thêm thành viên vào room
            roomRepository.save(room); // Lưu lại phòng với thành viên mới
        }

        return ResponseEntity.ok(room); // Trả về room nếu đúng
    }



    // get message of room
    @GetMapping("/{roomId}/messages")
    public ResponseEntity<List<Message>> getMessages(
            @PathVariable String roomId,
            @RequestParam(value = "page", defaultValue = "0",required = false) int page,
            @RequestParam(value = "size", defaultValue = "20",required = false) int size
    ){
        Room room= roomRepository.findByRoomId(roomId);
        if(room == null){
            return ResponseEntity.badRequest().build();
        }

        // get messages
        List<Message> messages = room.getMessages();
        int start = Math.max(0, messages.size() - (page + 1) * size);
        int end = Math.min( messages.size() ,start + size);
        List<Message>  paginatedMessages= messages.subList(start, end);
        return ResponseEntity.ok(paginatedMessages);

    }


}