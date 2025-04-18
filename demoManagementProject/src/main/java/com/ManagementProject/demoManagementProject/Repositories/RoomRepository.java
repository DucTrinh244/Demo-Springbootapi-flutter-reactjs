package com.ManagementProject.demoManagementProject.Repositories;

import com.ManagementProject.demoManagementProject.Models.Room;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface RoomRepository extends MongoRepository<Room,String> {
    Room findByRoomId(String roomId);
//    Optional<Room> findById(String id);
List<Room> findByMembersContaining(String userEmail);

}
