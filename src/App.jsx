import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import confetti from "canvas-confetti"
import { useDropzone } from "react-dropzone"

export default function App() {
  const [page, setPage] = useState("love")
  const [yes, setYes] = useState(false)
  const [albums, setAlbums] = useState([])
const audioRef = useRef(null)


  useEffect(() => {
    const saved = localStorage.getItem("albums")
    if (saved) setAlbums(JSON.parse(saved))
  }, [])

  useEffect(() => {
    localStorage.setItem("albums", JSON.stringify(albums))
  }, [albums])

  const fire = () => {
    setYes(true)
    confetti({
      particleCount: 400,
      spread: 150,
      origin: { y: 0.6 }
    })
  }

  return (
    <div style={container}>

      <Navbar setPage={setPage} audioRef={audioRef} />

      {page === "love" && <LovePage fire={fire} />}

      {page === "album" && (
        <AlbumPage albums={albums} setAlbums={setAlbums} />
      )}
      {page === "music" && (
  <MusicPage />
)}
    </div>
  )
}

/* ================= 组件 ================= */

function Navbar({ setPage, audioRef, musicIndex, setMusicIndex, musicList }) {
  const toggleMusic = () => {
    if (audioRef.current.paused) {
      audioRef.current.play()
    } else {
      audioRef.current.pause()
    }
  }
const nextMusic = () => {
  const next = (musicIndex + 1) % musicList.length
  setMusicIndex(next)
  setTimeout(() => {
    audioRef.current.play()
  }, 100)
}
//名字
  return (
    <nav style={navStyle}>
      <h2>💕 Our Story · 小陈 小谢 只属于我们的宇宙</h2>
      <div>
<button style={navBtnStyle} onClick={() => setPage("love")}>
  💌 告白
</button>

<button style={navBtnStyle} onClick={() => setPage("album")}>
  📷 相册
</button>

<button style={navBtnStyle} onClick={() => setPage("music")}>
  🎵 音乐
</button>

<button style={navBtnStyle} onClick={nextMusic}>
  ⏭ 下一首
</button>
      </div>
    </nav>
  )
}

function LovePage({ fire }) {
const [stage, setStage] = useState(1)
const [showText, setShowText] = useState(false)
  const [noPos, setNoPos] = useState({ top: "60%", left: "55%" })

  const moveButton = () => {
    setNoPos({
      top: Math.random() * 80 + "%",
      left: Math.random() * 80 + "%"
    })
  }

  return (
    <div style={centerBox}>
      <motion.h1
        style={titleStyle}
        animate={{ backgroundPosition: ["0%", "100%"] }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        {stage === 1
  ? "你愿意一直爱着我吗 💖💕"
  : "我一定会一直爱你 💍"} 
      </motion.h1>

<button
  style={yesBtn}
onClick={() => {
  if (stage === 1) {
    setStage(2)
  } else {
    fire()
    setShowText(true)

    setTimeout(() => {
      setShowText(false)
      setStage(1)
    }, 3000)
  }
}}
>
  我愿意
</button>

{stage === 1 && (
  <button
    style={{ ...noBtn, position: "absolute", ...noPos }}
    onMouseEnter={moveButton}
  >
    我不愿意
  </button>
)}

{showText && (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    style={loveEffect}
  >
    💖 我就知道你会答应 💖
  </motion.div>
)}
    </div>
  )
}

function AlbumPage({ albums, setAlbums }) {
  const [title, setTitle] = useState("")
  const [desc, setDesc] = useState("")
  const [img, setImg] = useState("")
  const [selected, setSelected] = useState(null)

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0]
    const reader = new FileReader()
    reader.onload = () => setImg(reader.result)
    reader.readAsDataURL(file)
  }

  const { getRootProps, getInputProps } = useDropzone({ onDrop })

  const addAlbum = () => {
    if (!title || !desc) return
    setAlbums([...albums, { title, desc, img }])
    setTitle("")
    setDesc("")
    setImg("")
  }

  const deleteAlbum = (i) => {
    setAlbums(albums.filter((_, index) => index !== i))
  }

  return (
<div style={albumContainer}>
  <h2 style={albumTitle}>💌 添加我们的故事</h2>

  <div style={formBox}>
<input
  style={inputStyle}
  placeholder="故事标题"
  value={title}
  onChange={(e) => setTitle(e.target.value)}
/>

<textarea
  style={inputStyle}
  placeholder="写下我们的故事..."
  value={desc}
  onChange={(e) => setDesc(e.target.value)}
/>
        <input
          placeholder="故事"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />

        <div {...getRootProps()} style={dropBox}>
          <input {...getInputProps()} />
          拖拽图片到这里 或 点击上传
        </div>

<button style={addBtnStyle} onClick={addAlbum}>
  ✨ 添加故事
</button>
      </div>

      <div style={albumWrap}>
        {albums.map((item, i) => (
<motion.div
  key={i}
  style={card}
  whileHover={{ scale: 1.05 }}
  onClick={() => setSelected(item)}
>
            {item.img && (
              <img src={item.img} style={imgStyle} />
            )}
            <h3>{item.title}</h3>
            <p>{item.desc}</p>
            <button onClick={() => deleteAlbum(i)}>删除</button>
          </motion.div>
        ))}
        {selected && (
  <div style={modalOverlay} onClick={() => setSelected(null)}>
    <motion.div
      initial={{ scale: 0.7, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
      style={modalBox}
      onClick={(e) => e.stopPropagation()}
    >
      {selected.img && (
        <img src={selected.img} style={{ width: "100%", borderRadius: 20 }} />
      )}
      <h2 style={{ marginTop: 20 }}>{selected.title}</h2>
      <p style={{ marginTop: 15, fontSize: 18 }}>{selected.desc}</p>
      <button onClick={() => setSelected(null)}>关闭</button>
    </motion.div>
  </div>
)}
      </div>
    </div>
  )
}

/* ================= 样式 ================= */

const container = {
  minHeight: "100vh",
  width: "100vw",
  background: "radial-gradient(circle at top,#ffe6f0,#e0f7fa)",
  fontFamily: "system-ui"
}

const navStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "25px 60px",
  background: "rgba(255,255,255,0.75)",
  backdropFilter: "blur(12px)",
  boxShadow: "0 5px 20px rgba(0,0,0,0.08)"
}

const navBtnStyle = {
  padding: "12px 26px",
  fontSize: "18px",
  fontWeight: "600",
  borderRadius: "30px",
  border: "none",
  cursor: "pointer",
  marginLeft: "12px",
  background: "linear-gradient(135deg,#ff9a9e,#fad0c4)",
  color: "white",
  boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
  transition: "all 0.3s ease"
}

const centerBox = {
  textAlign: "center",
  marginTop: "120px",
  position: "relative"
}

const titleStyle = {
  fontSize: "80px",
  fontWeight: "900",
  background: "linear-gradient(90deg,#ff4081,#7c4dff,#00bcd4)",
  backgroundSize: "200%",
  WebkitBackgroundClip: "text",
  color: "transparent",
  textShadow: "0 10px 30px rgba(0,0,0,0.2)"
}

const yesBtn = {
  padding: "15px 40px",
  fontSize: 22,
  background: "#ff80ab",
  border: "none",
  borderRadius: 40,
  cursor: "pointer",
  marginRight: 20
}

const noBtn = {
  padding: "15px 40px",
  fontSize: 22,
  background: "#90caf9",
  border: "none",
  borderRadius: 40,
  cursor: "pointer"
}

const loveEffect = {
  marginTop: 40,
  fontSize: 30,
  color: "#ff4081"
}

const formBox = {
  background: "rgba(255,255,255,0.8)",
  backdropFilter: "blur(15px)",
  padding: "30px",
  borderRadius: "25px",
  boxShadow: "0 20px 50px rgba(0,0,0,0.1)",
  display: "flex",
  flexDirection: "column",
  gap: "15px",
  maxWidth: "500px",
  marginBottom: "40px"
}

const dropBox = {
  border: "2px dashed #aaa",
  padding: 20,
  cursor: "pointer",
  borderRadius: 15
}

const albumWrap = {
  display: "flex",
  gap: 20,
  flexWrap: "wrap"
}

const card = {
  width: 280,
  background: "rgba(255,255,255,0.9)",
  borderRadius: "25px",
  padding: "20px",
  cursor: "pointer",
  boxShadow: "0 15px 40px rgba(0,0,0,0.1)",
  transition: "0.3s"
}

const imgStyle = {
  width: "100%",
  borderRadius: 15,
  marginBottom: 10
}
//故事新增

const inputStyle = {
  padding: "15px",
  borderRadius: "15px",
  border: "1px solid #eee",
  fontSize: "16px",
  outline: "none",
  background: "#fafafa"
}

//音乐新增
function MusicPage() {
  const [musicList, setMusicList] = useState([])
  const [currentIndex, setCurrentIndex] = useState(null)
  const audioRef = useRef(null)

  useEffect(() => {
    const saved = localStorage.getItem("myMusic")
    if (saved) setMusicList(JSON.parse(saved))
  }, [])

  useEffect(() => {
    localStorage.setItem("myMusic", JSON.stringify(musicList))
  }, [musicList])

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0]
    const reader = new FileReader()
    reader.onload = () => {
      setMusicList(prev => [
        ...prev,
        { name: file.name, src: reader.result }
      ])
    }
    reader.readAsDataURL(file)
  }

  const { getRootProps, getInputProps } = useDropzone({ onDrop })

  const playMusic = (index) => {
    setCurrentIndex(index)
    setTimeout(() => {
      audioRef.current.play()
    }, 100)
  }

  const deleteMusic = (index) => {
    setMusicList(prev => prev.filter((_, i) => i !== index))

    if (index === currentIndex) {
      setCurrentIndex(null)
    }
  }

  return (
    <div style={albumContainer}>
      <h2 style={albumTitle}>🎵 我们的专属音乐</h2>

      <div {...getRootProps()} style={dropBox}>
        <input {...getInputProps()} />
        拖拽音频文件到这里 或 点击上传
      </div>

      {currentIndex !== null && (
        <div style={{ marginTop: 30 }}>
          <h3>正在播放：{musicList[currentIndex]?.name}</h3>
          <audio
            key={musicList[currentIndex]?.src}
            ref={audioRef}
            src={musicList[currentIndex]?.src}
            controls
          />
        </div>
      )}

      <div style={albumWrap}>
        {musicList.map((item, i) => (
          <div key={i} style={card}>
            <p>{item.name}</p>
            <button onClick={() => playMusic(i)}>播放</button>
            <button onClick={() => deleteMusic(i)}>删除</button>
          </div>
        ))}
      </div>
    </div>
  )
}

//新增弹窗
const modalOverlay = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  background: "rgba(0,0,0,0.6)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 999
}

const modalBox = {
  background: "white",
  padding: "40px",
  borderRadius: "30px",
  maxWidth: "600px",
  width: "90%"
}
const logoStyle = {
  fontSize: "22px",
  fontWeight: "700",
  background: "linear-gradient(90deg,#ff4d6d,#7b2ff7)",
  WebkitBackgroundClip: "text",
  color: "transparent",
  letterSpacing: "1px"
}

const albumContainer = {
  padding: "60px 20px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center"
}

const albumTitle = {
  fontSize: "32px",
  marginBottom: "30px",
  fontWeight: "700",
  background: "linear-gradient(90deg,#ff758c,#7b2ff7)",
  WebkitBackgroundClip: "text",
  color: "transparent"
}
//新增
const addBtnStyle = {
  padding: "15px",
  borderRadius: "30px",
  border: "none",
  fontSize: "16px",
  fontWeight: "600",
  cursor: "pointer",
  background: "linear-gradient(135deg,#ff758c,#ff7eb3)",
  color: "white",
  boxShadow: "0 10px 25px rgba(255,118,150,0.4)",
  transition: "all 0.3s ease"
}