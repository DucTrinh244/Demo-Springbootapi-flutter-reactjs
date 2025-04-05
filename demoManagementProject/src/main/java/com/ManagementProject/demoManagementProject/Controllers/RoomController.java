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

import java.util.List;

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
        String roomId = roomRequest.getRoomId();
        String userEmail = roomRequest.getUserEmail();

        // Kiểm tra phòng đã tồn tại
        if (roomRepository.findByRoomId(roomId) != null) {
            return ResponseEntity.badRequest().body("Room already exists");
        }

        // Kiểm tra user có tồn tại không
        User user = userRepository.findByEmail(userEmail); // hoặc findById(userId).orElse(null)
        if (user == null) {
            return ResponseEntity.badRequest().body("User not found");
        }

        // Tạo room
        Room room = new Room();
        room.setRoomId(roomId);
        room.setUserEmail(userEmail);

        Room savedRoom = roomRepository.save(room);

        return ResponseEntity.status(HttpStatus.CREATED).body(savedRoom);
    }



    // join rooms

    @GetMapping("/{roomId}")
    public ResponseEntity<?> joinRooms(@PathVariable String roomId){// chú ý pathvariable

        Room room =roomRepository.findByRoomId(roomId);

        if(room == null){
            return ResponseEntity.badRequest().body("Room not found");
        }
        return ResponseEntity.ok(room);// return room

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