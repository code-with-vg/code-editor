import React, { useEffect, useRef, useState } from 'react'
import Client from './Client';
import Editor from './Editor';
import { initSocket } from '../socket';
import { useNavigate ,useLocation , useParams, Navigate} from 'react-router-dom';
import {toast} from 'react-hot-toast'

function EditorPage() {
  const [clients, setClient] = useState([]);
  const socketRef = useRef(null);
  const codeRef = useRef(null);
  const location = useLocation();
  const { roomId }= useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();
      socketRef.current.on('connect_error', (err) => handleError(err));
      socketRef.current.on('connect_failed', (err) => handleError(err));
      
      const handleError = (e) => {
        console.log("socket error", e)
        toast.error("Socket connection failed, Try again later");
        navigate("/");
      }
      
      socketRef.current.emit('join', {
        roomId,
        username: location.state?.username,
      });

      socketRef.current.on('joined',({clients, username, socketId}) => {
        if(username !== location.state.username)
          {
            toast.success(`${username} joined`);
            
          }
          setClient(clients);
          socketRef.current.emit('sync-code', {code:codeRef.current,
            socketId,
          });
      });

      socketRef.current.on('disconnected', ({socketId, username}) => {
        toast.success(`${username} Leave Room`);
        setClient((prev) => {
          return prev.filter((client) => client.socketId != socketId)
        })
      })
    };
    init();

    return () => {
      socketRef.current.disconnect();
      socketRef.current.off('joined');
      socketRef.current.off('disconnected');
    }
  }, []);
 

  if(!location.state){
    return <Navigate to="/" />
  }

  const copyroomid = async () =>{
    try{
      await navigator.clipboard.writeText(roomId);
      toast.success("RoomId is Copy");
    }
    catch(e){
      toast.error("can't copy roomId")
    }
  };

  const leaveroom = () => {
    navigate("/");
    window.onpopstate = () =>{
      window.history.go(1);
    }
  }

  return (
    <div className='container-fluid vh-100'>
      <div className='row h-100'>
        <div className='col-md-2 bg-dark text-light d-flex flex-column h-100' style={{borderRight:'4px solid #fff'}}>
          <img src='../logo2.png' alt='LiveCode' className='img-fluid mx-auto'
          style={{maxWidth:'200px', marginTop:'4px'}}/>
          <hr style={{marginTop:'-0.1rem'}}/>
          <div className='d-flex flex-column overflow-auto'>
            {clients.map((client) => (
              <Client key={client.socketId} username={client.username}/>
            ))}
          </div>
          
          <div className='mt-auto'>
            <hr/>
            <button  onClick={copyroomid} className='btn btn-success px-4'><svg xmlns="http://www.w3.org/2000/svg" width="19" height="21" fill="currentColor" class="bi bi-copy" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z"/>
</svg>&nbsp;&nbsp;Copy Room Id</button>&nbsp;&nbsp;

            <button onClick={leaveroom} className='btn btn-danger mt-3 mb-3 px-4 btn-block'><svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" fill="currentColor" class="bi bi-box-arrow-in-left" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M10 3.5a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-2a.5.5 0 0 1 1 0v2A1.5 1.5 0 0 1 9.5 14h-8A1.5 1.5 0 0 1 0 12.5v-9A1.5 1.5 0 0 1 1.5 2h8A1.5 1.5 0 0 1 11 3.5v2a.5.5 0 0 1-1 0z"/>
  <path fill-rule="evenodd" d="M4.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H14.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708z"/>
</svg>&nbsp;&nbsp; Leave Room&nbsp;&nbsp;</button>
          </div>
        </div>
        <div className='col-md-10 text-light d-flex flex-column h-100'>
            <Editor socketRef={socketRef} roomId={roomId} onCodeChange={(code) => codeRef.current = code}/>
        </div>
      </div>
    </div>
  )
}

export default EditorPage
