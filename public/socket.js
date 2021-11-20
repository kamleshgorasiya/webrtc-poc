const socket = io('/')
const myPeer =  new Peer(undefined,{
    host:'/',
    port: '3001'
})
const videoGrid = document.getElementById('video-grid');
const myVideo = document.createElement('video')
myVideo.muted=true
const peers = [];
navigator.mediaDevices.getUserMedia({
    audio:true,
    video:true
}).then(stream =>{

    addVideoStream(myVideo,stream)

    socket.on('user-connected',userId=>{
        newUserConnected(userId,stream)
    })

    myPeer.on('call',call=>{
        call.answer(stream)
        const video = document.createElement('video');
        call.on('stream',userStream=>{
            addVideoStream(video,userStream)
        })
    })
})
socket.on('user-disconnected',userId=>{
    if(peers[userId])
        peers[userId].close()
})
myPeer.on('open', id=>{
    socket.emit('join-room',ROOM_ID,id);
})

function newUserConnected(userId, stream){
    const call = myPeer.call(userId,stream)
    const userVideo = document.createElement('video')
    call.on('stream',userVideoStream=>{        
        addVideoStream(userVideo, userVideoStream)
    })
    call.on('close',()=>{
        userVideo.remove();
    })
    peers[userId] = call
}

function addVideoStream(video,stream){
    video.srcObject= stream;                                                                                                                                                                                                                                                                                                                                     ;
    video.addEventListener('loadedmetadata',()=>{
        video.play()
    })
    videoGrid.append(video);
}