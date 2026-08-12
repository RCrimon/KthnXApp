import type { Server, Socket } from "socket.io";
import {v4 as uuidv4} from "uuid"

interface userint { 
  _id : string
  interestedIn : 'Male' | 'Female' |'Both'
  gender : 'Male' | 'Female'
}

interface waitingList {
  socketId : string ;
  userId : string;
  interestedIn : 'Male' | 'Female' |'Both';
  gender : 'Male' | 'Female';
}

let waitingQueue : waitingList[] = []
const activeUsers = new Set<string>()



export const handleMatchmaking = (io:Server,socket:Socket)=>{

  socket.on("join-matchmaking",()=>{
    const user =  socket.data?.user as userint | undefined
    if(!user?._id) return

    const userId = user._id.toString()
    const {gender, interestedIn} = user

    if(activeUsers.has(userId)){
      socket.emit("match-error", "You are already in an active match in another tab!");
      return
    }
    
    const alreadyInQueue = waitingQueue.some((u)=> u.userId === userId)
    if(alreadyInQueue){
      socket.emit("match-error", "You are already searching for a match in another tab!");
      return
    }

    let matchIndex = -1 
    while (waitingQueue.length > 0) {
      matchIndex = waitingQueue.findIndex((candidaate)=>{
        const userMatchesCandidate = interestedIn === 'Both' || interestedIn === candidaate.gender
        const candidateMatchesUser = candidaate.interestedIn === 'Both' || candidaate.interestedIn === gender 
        return userMatchesCandidate && candidateMatchesUser && candidaate.userId !== userId
      })

      if (matchIndex === -1) break

      const partnerCandidate = waitingQueue[matchIndex]
      const partnerSocket = io.sockets.sockets.get(partnerCandidate?.socketId!)
      if (partnerSocket && partnerSocket.connected){
        break
      }else {
        waitingQueue.splice(matchIndex,1)
        matchIndex = -1
      }
    }

    if(matchIndex !== -1){
      const partner = waitingQueue.splice(matchIndex,1)[0]
      if(!partner) return
      const roomId = `room-${uuidv4()}`
      activeUsers.add(userId)
      activeUsers.add(partner.userId)
      socket.join(roomId)
      io.sockets.sockets.get(partner.socketId)?.join(roomId)
      socket.emit("match-found", { roomId, partnerId: partner.userId });
      io.to(partner.socketId).emit("match-found", { roomId, partnerId: userId });
    }else{
      waitingQueue.push({
        socketId : socket.id,
        userId : user._id,
        gender,
        interestedIn
      })
      socket.emit("waiting-for-match", "Searching for a partner...")
    }
  
  })

  socket.on("send-message",({roomId,message}:{roomId :string, message :string})=>{
    const user = socket.data?.user as userint | undefined
    if(!user?._id || !roomId || !message) return

    socket.to(roomId).emit("receive-message",{
      senderId : user._id.toString(),
      message,
      createdAt : new Date().toISOString()
    })
  })

  socket.on("typing", ({ roomId }: { roomId: string }) => {
    socket.to(roomId).emit("user-typing", { isTyping: true });
  });
  
  socket.on("stop-typing", ({ roomId }: { roomId: string }) => {
    socket.to(roomId).emit("user-typing", { isTyping: false });
  });
  
   const cleanupUser = (userId : string | undefined)=>{
    waitingQueue = waitingQueue.filter((u)=> u.userId !== userId && u.socketId !== socket.id)
    if(userId){
      activeUsers.delete(userId)
    }
    for (const roomId of socket.rooms) {
      if(roomId !== socket.id){
        socket.to(roomId).emit("partner-left")
        const roomSocket = io.sockets.adapter.rooms.get(roomId)
        if(roomSocket){
          roomSocket.forEach((partnerSocketId)=>{
            if(partnerSocketId !== socket.id ){
              const partnerSocket =  io.sockets.sockets.get(partnerSocketId)
              const partnerUser = partnerSocket?.data?.user as userint | undefined
              if(partnerUser?._id){
                activeUsers.delete(partnerUser._id.toString())
              }
              partnerSocket?.leave(roomId)
            }
          })
        }
       socket.leave(roomId)
    }
 } 
}

  socket.on("leave-room",()=>{
    const user = socket.data?.user as userint | undefined
    cleanupUser(user?._id?.toString())
  })
  socket.on("cancel-matchmaking",()=>{
     const user = socket.data?.user as userint | undefined
    cleanupUser(user?._id?.toString())
  })

  socket.on("disconnecting",()=>{
    const user = socket.data?.user as userint | undefined
    cleanupUser(user?._id?.toString())
  })
  }