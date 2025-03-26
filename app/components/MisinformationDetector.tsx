"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { FileText, Link, Upload, Video, AlertTriangle, CheckCircle, Mic, Image } from "lucide-react"
import { PieChart, Pie, Cell, ResponsiveContainer, Label } from "recharts"

export default function MisinformationDetector() {
  const [result, setResult] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedType, setSelectedType] = useState("text")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const currentSelectedType: string = selectedType; // Use the state variable directly
    const elements = e.currentTarget.elements as typeof e.currentTarget.elements & {
      text: HTMLTextAreaElement;
      link: HTMLInputElement;
      image: HTMLInputElement;
      video: HTMLInputElement;
      audio: HTMLInputElement;
      file: HTMLInputElement;
    };

    const content = selectedType === "text" ? elements["text"].value : elements[selectedType].value;
    const requestBody = JSON.stringify({ type: selectedType, content })

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: requestBody,
      })

      if (!response.ok) {
        throw new Error("Analysis failed")
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError("An error occurred during analysis. Please check the input and try again.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const renderPieChart = (percentage: number) => {
    const data = [
      { name: "Real", value: percentage },
      { name: "Questionable", value: 100 - percentage },
    ]
    const COLORS = ["#4CAF50", "#FF5722"]

    return (
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={80} dataKey="value">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
            <Label value={`${percentage}%`} position="center" fill="#ffffff" style={{ fontSize: "2rem", fontWeight: "bold" }} />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    )
  }

  return (
    <div className="w-[600px] backdrop-blur-md bg-gray-800/30 border-gray-700">
      <div className="p-6">
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="flex justify-between mb-4">
            {[
              { label: "Text", value: "text", icon: <FileText className="w-6 h-6" /> },
              { label: "Link", value: "link", icon: <Link className="w-6 h-6" /> },
              { label: "Image", value: "image", icon: <Image className="w-6 h-6" /> },
              { label: "Video", value: "video", icon: <Video className="w-6 h-6" /> },
              { label: "Audio", value: "audio", icon: <Mic className="w-6 h-6" /> },
              { label: "File", value: "file", icon: <Upload className="w-6 h-6" /> },
            ].map((option) => (
              <button
                type="button"
                key={option.value}
                className={`p-2 rounded-md ${selectedType === option.value ? "bg-blue-600" : "bg-gray-700"}`}
                onClick={() => setSelectedType(option.value)}
              >
                {option.icon}
              </button>
            ))}
          </div>

          <input type="hidden" name="type" value={selectedType} />

          {selectedType === "text" && (
            <textarea name="text" placeholder="Enter text to analyze" className="mb-4 bg-gray-700 border-gray-600 text-white w-full" />
          )}
          {selectedType === "link" && (
            <input type="url" name="link" placeholder="Enter a URL" className="mb-4 bg-gray-700 border-gray-600 text-white w-full" />
          )}
          {["image", "video", "audio", "file"].includes(selectedType) && (
            <input type="file" name={selectedType} className="mb-4 bg-gray-700 border-gray-600 text-white w-full" accept={
              selectedType === "image" ? "image/*" : selectedType === "video" ? "video/*" : selectedType === "audio" ? "audio/*" : "*"
            } />
          )}

          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
            {isLoading ? "Analyzing..." : "Detect Misinformation"}
          </button>
        </form>

        {error && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="mt-6 p-4 bg-red-500/50 rounded-md text-white">
            {error}
          </motion.div>
        )}

        {result && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="mt-6 p-4 bg-gray-700/50 rounded-md text-white">
            <h2 className="text-2xl font-semibold mb-4 text-center">Analysis Results</h2>
            <div className="flex items-center justify-center mb-4">{renderPieChart(result.percentageReal)}</div>
            <div className="flex items-center justify-center mb-6">
              {result.percentageReal >= 70 ? <CheckCircle className="w-8 h-8 text-green-500 mr-2" /> : <AlertTriangle className="w-8 h-8 text-yellow-500 mr-2" />}
              <p className="text-2xl font-bold">{result.percentageReal >= 70 ? "Likely True" : "Potentially Misleading"}</p>
            </div>
            <div className="bg-gray-800/50 p-4 rounded-md mb-6">
              <p className="text-lg leading-relaxed whitespace-pre-wrap">{result.analysis}</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
