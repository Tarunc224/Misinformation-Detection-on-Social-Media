"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"

const words = ["Truth", "Fact", "Evidence", "Source", "Verify", "Rumor", "Fake", "Misleading", "Propaganda", "Hoax"]

const BackgroundAnimation = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    class Particle {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      word: string
      color: string
      opacity: number
      fadeDirection: 1 | -1

      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 20 + 10
        this.speedX = Math.random() * 3 - 1.5
        this.speedY = Math.random() * 3 - 1.5
        this.word = words[Math.floor(Math.random() * words.length)]
        this.color = this.word.length <= 5 ? "#4CAF50" : "#FF5722"
        this.opacity = Math.random()
        this.fadeDirection = Math.random() > 0.5 ? 1 : -1
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY

        if (this.x > canvas.width) this.x = 0
        else if (this.x < 0) this.x = canvas.width
        if (this.y > canvas.height) this.y = 0
        else if (this.y < 0) this.y = canvas.height

        this.opacity += 0.005 * this.fadeDirection
        if (this.opacity <= 0 || this.opacity >= 1) {
          this.fadeDirection *= -1
        }
      }

      draw() {
        if (!ctx) return
        ctx.globalAlpha = this.opacity
        ctx.fillStyle = this.color
        ctx.font = `${this.size}px Arial`
        ctx.fillText(this.word, this.x, this.y)
        ctx.globalAlpha = 1
      }
    }

    const particles: Particle[] = []
    for (let i = 0; i < 50; i++) {
      particles.push(new Particle())
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach((particle) => {
        particle.update()
        particle.draw()
      })
      requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return (
    <>
      <canvas ref={canvasRef} className="fixed inset-0 z-0" />
      <motion.div
        className="fixed inset-0 z-10 bg-gradient-to-b from-gray-900/50 via-gray-900/70 to-gray-900"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
      />
    </>
  )
}

export default BackgroundAnimation

