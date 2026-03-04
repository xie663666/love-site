import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import confetti from "canvas-confetti"

export default function App() {
  const [page, setPage] = useState("love")
  const [yes, setYes] = useState(false)
  const [noPos, setNoPos] = useState({ top: "60%", left: "55%" })
  const [albums, setAlbums] = useState([])
  const [title, setTitle] = useState("")
  const [desc, setDesc] = useState("")
  const [img, setImg] = useState("")

  // 读取本地存储
  useEffect(() => {
    const saved = localStorage.getItem("albums")
    if (saved) setAlbums(JSON.parse(saved))
  }, [])

  // 保存到本地
  useEffect(() => {
    localStorage.setItem("albums", JSON.stringify(albums))
  }, [albums])

  const moveButton = () => {
    const x = Math.random() * 80
    const y = Math.random() * 80
    setNoPos({ top: y + "%", left: x + "%" })
  }

  const addAlbum = () => {
    if (!title || !desc) return
    setAlbums([...albums, { title, desc, img }])
    setTitle("")
    setDesc("")
    setImg("")
  }

  const deleteAlbum = (index) => {
    const newList = albums.filter((_, i) => i !== index)
    setAlbums(newList)
  }

  return (
    <div style={container}>
<audio
  src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
  autoPlay
  loop
/>
      {/* 导航 */}
      <nav style={navStyle}>
        <span>💕 Moment · 只属于我们的宇宙</span>
        <div>
          <button onClick={() => setPage("love")}>告白</button>
          <button onClick={() => setPage("album")}>情侣相册</button>
        </div>
      </nav>

      {/* 告白页面 */}
      {page === "love" && (
        <div style={centerBox}>
          <motion.h1
  style={{
    fontSize: "80px",
    fontWeight: "900",
    letterSpacing: "3px",
    textShadow: "0 10px 30px rgba(0,0,0,0.2)"
  }}
  animate={yes ? { scale: [1, 1.4, 1] } : {}}
  transition={{ duration: 0.8 }}
>
  你愿意跟我约会吗 💕
</motion.h1>

<button
  style={yesBtn}
  onClick={() => {
    setYes(true)
    confetti({
      particleCount: 300,
      spread: 120,
      origin: { y: 0.6 }
    })
  }}
>
  我愿意
</button>

          <button
            style={{ ...noBtn, position: "absolute", ...noPos }}
            onMouseEnter={moveButton}
            onClick={moveButton}
          >
            我不愿意
          </button>

          {yes && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
              style={loveEffect}
            >
              💖💖💖 我就知道你会答应 💖💖💖
            </motion.div>
          )}
        </div>
      )}

      {/* 相册页面 */}
      {page === "album" && (
        <div style={{ padding: 40 }}>
          <h2>添加我们的故事</h2>

          <div style={{ marginBottom: 20 }}>
            <input
              placeholder="标题"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <input
              placeholder="故事"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
            <input
              placeholder="图片URL（可选）"
              value={img}
              onChange={(e) => setImg(e.target.value)}
            />
            <button onClick={addAlbum}>添加</button>
          </div>

          <div style={albumWrap}>
            {albums.map((item, i) => (
              <motion.div key={i} style={card} whileHover={{ scale: 1.05 }}>
                {item.img && (
                  <img
                    src={item.img}
                    style={{ width: "100%", borderRadius: 15 }}
                  />
                )}
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
                <button onClick={() => deleteAlbum(i)}>删除</button>
              </motion.div>
            ))}
          </div>
        </div>
      )}

    </div>
  )
}

const container = {
  minHeight: "100vh",
  width: "100vw",
  background: "linear-gradient(135deg,#e0f7fa,#fce4ec)",
  fontFamily: "sans-serif"
}

const navStyle = {
  display: "flex",
  justifyContent: "space-between",
  padding: "20px 40px",
  background: "rgba(255,255,255,0.6)"
}

const centerBox = {
  textAlign: "center",
  marginTop: "120px",
  position: "relative"
}

const yesBtn = {
  padding: "15px 30px",
  fontSize: 20,
  background: "#ff80ab",
  border: "none",
  borderRadius: 30,
  cursor: "pointer",
  marginRight: 20
}

const noBtn = {
  padding: "15px 30px",
  fontSize: 20,
  background: "#90caf9",
  border: "none",
  borderRadius: 30,
  cursor: "pointer"
}

const loveEffect = {
  marginTop: 40,
  fontSize: 28,
  color: "#ff4081"
}

const albumWrap = {
  display: "flex",
  gap: 20,
  flexWrap: "wrap"
}

const card = {
  width: 250,
  background: "white",
  borderRadius: 20,
  padding: 15,
  boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
}