// Socket connection
const socket = io.connect("/");

// Storing of peers in an array
let peers = {};

// Names
let Name = prompt("Enter your name ");
if(Name){

}else{
  Name = "user";
}
console.log(Port)
// Our viedo
let myVideo = document.createElement("video");
myVideo.muted = true;
let myvideostream;

// Video grid
let videoGrid = document.querySelector(".video__grid");

// Setting a Peer
var peer = new Peer(undefined, {
  path: "/peerjs",
  host: "/",
  port: Port,
});

// Getting our stream
navigator.mediaDevices
  .getUserMedia({
    video: true,
    audio: true,
  })
  .then((stream) => {
    myvideostream = stream;
    // Adding our stream to Video grid
    addVideoStream(myVideo, stream);

    // Calling the Peer and Answering
    peer.on("call", (call) => {
      call.answer(stream);
      const video = document.createElement("video");
      call.on("stream", (userVideoStream) => {
        addVideoStream(video, userVideoStream);
      });
    });

    // Userconnected event.....
    socket.on("user-connected", (Data) => {
      setTimeout(ConnectToNewUser, 100, Data, stream);
    });

    // User disconnected....
    socket.on("user-disconnected", (Data) => {
      if (peers[Data.id]) {
        peers[Data.id].close();
      }
    });
  });

// Peer connections & Socket Connections

peer.on("open", (id) => {
  socket.emit("joined", { RoomId: RoomId, id: id });
});

const ConnectToNewUser = (Data, stream) => {
  const call = peer.call(Data?.id, stream);
  const video = document.createElement("video");
  call.on(
    "stream",
    (userVideoStream) => {
      addVideoStream(video, userVideoStream);
    },
    (err) => {
      console.error(err);
    }
  );

  call.on("close", () => {
    video.remove();
  });

  peers[Data.id] = call;
};

// Adding Video streams

const addVideoStream = (video, stream) => {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });
  videoGrid.append(video);
};

// Mute and Unmute
const MuteAndUnmute = () => {
  const on = myvideostream.getAudioTracks()[0].enabled;
  if (on) {
    myvideostream.getAudioTracks()[0].enabled = false;
    ChangethemuteIcon();
  } else {
    myvideostream.getAudioTracks()[0].enabled = true;
    ChangetheunmuteIcon();
  }
};

const ChangetheunmuteIcon = () => {
  const HTML = `
        <i class="fa fa-microphone icons"></i>
  `;
  document.querySelector(".body__mute__btn").innerHTML = HTML;
};

const ChangethemuteIcon = () => {
  const HTML = `
        <i class="fa fa-microphone-slash icons unmute"></i>
  `;
  document.querySelector(".body__mute__btn").innerHTML = HTML;
};

// Video off and on

const Videooff = () => {
  const on = myvideostream.getVideoTracks()[0].enabled;
  if (on) {
    myvideostream.getVideoTracks()[0].enabled = false;
    ChangethevidoIcon();
  } else {
    myvideostream.getVideoTracks()[0].enabled = true;
    ChangethevideooffIcon();
  }
};

const ChangethevidoIcon = () => {
  const HTML = `
        <i class="unvideo fa fa-video-slash icons"></i>
  `;
  document.querySelector(".body__video__btn").innerHTML = HTML;
};
const ChangethevideooffIcon = () => {
  const HTML = `
        <i class="fa fa-video icons"></i>
  `;
  document.querySelector(".body__video__btn").innerHTML = HTML;
};

// Messaging

let text = document.querySelector("input");
const SubmitName = (e) => {
  e.preventDefault();
  if(text.value){
    socket.emit("NameSent", { Message: text.value, Name: Name });
  }
};
socket.on("NameSent", (Messages) => {
  document.querySelector(".participants__list").innerHTML += `
  <div class="participent">
  <div style="display:flex;align-items:center;flex-direction:row;color:grey">
  <i class="fas fa-user-circle"></i>
  <p>${Messages.Name}</p>
  </div>
  <span style="font-size:12px;margin-left:15px;margin-top:5px">${Messages.Message}</span>
  </div>
  `;
  document.querySelector("input").value = "";
  console.log("Scrolll")
  document.querySelector('.participants__list').scrollTo({ left: 0, top: 19999, behavior: "smooth" })
});

