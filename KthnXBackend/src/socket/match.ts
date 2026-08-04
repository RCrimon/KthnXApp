import type { Server, Socket } from "socket.io";
import {v4 as uuidv4} from "uuid"

interface userint { 
  _id : string
  interestedIn : 'Male' | 'Female' |'Both'
  gender : 'Male' | 'Female'
}

interface waitingList {
  socketId : string
  userId : string
  interestedIn : 'Male' | 'Female' |'Both'
  gender : 'Male' | 'Female'
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

    const matchIndex = waitingQueue.findIndex((candidate)=>{
      const userMatchesCandidate = interestedIn === 'Both' || interestedIn === candidate.gender
      const candidateMatchesUser = candidate.interestedIn === 'Both' || candidate.interestedIn === gender
      return userMatchesCandidate && candidateMatchesUser && candidate.userId !== userId.toString()
    })

   

    if(matchIndex !== -1){
     const partner = waitingQueue.splice(matchIndex,1)[0]
     if(!partner) return
     const roomId = `room-${uuidv4()}`

     activeUsers.add(userId)
     activeUsers.add(partner?.userId as string)
     

     socket.join(roomId)
     io.sockets.sockets.get(partner.socketId)?.join(roomId)
     
     io.to(socket.id).emit("match-found", {roomId,partnerId:partner?.userId})
     io.to(partner?.socketId || '').emit("match-found", {roomId,partnerId:userId}) 
     console.log(`Match Done! Room: ${roomId}`);
    }
    else{
        waitingQueue.push({
          socketId : socket.id,
          userId : userId.toString(),
          gender,
          interestedIn
        })
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