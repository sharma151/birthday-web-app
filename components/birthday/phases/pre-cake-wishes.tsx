"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export function PreCakeWishes({ onNext }: { onNext: () => void }) {
  const [showNoState, setShowNoState] = useState(false)

  return (
    <div className="flex w-full max-w-xl flex-col items-center text-center">
      <AnimatePresence mode="wait">
        {!showNoState ? (
          <motion.div
            key="question"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col items-center"
          >
            <h2 className="text-balance font-serif text-4xl font-bold leading-tight text-foreground sm:text-5xl">
              Happy Birthday! 🎈
              <br />
              <span className="mt-2 block text-primary text-3xl sm:text-4xl">
                23 Years Old!
              </span>
            </h2>
            <p className="mt-6 text-lg font-semibold text-muted-foreground">
              Are you ready to cut the cake? 🎂
            </p>

            <div className="mt-8 flex w-full flex-col items-center justify-center gap-4 sm:flex-row">
              <motion.button
                onClick={onNext}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto rounded-full bg-primary px-8 py-4 text-lg font-bold text-primary-foreground shadow-xl"
              >
                Let's cut the cake! 🎉
              </motion.button>
              <motion.button
                onClick={() => setShowNoState(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto rounded-full border-2 border-border bg-card px-8 py-4 text-lg font-bold text-muted-foreground shadow-lg"
              >
                No 🙅‍♀️
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="angry"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center"
          >
            {/* 💡 UPDATE THE src BELOW TO CHANGE THE SARCASTIC GIF */}
            <img 
              src="https://media.giphy.com/media/VdhTYle3b9a6jtO7FJ/giphy.gif" 
              alt="Sarcastic Why" 
              className="h-48 w-auto rounded-3xl shadow-xl border-4 border-border/50 object-cover"
            />
            <h2 className="mt-6 text-balance font-serif text-2xl font-bold leading-tight text-foreground sm:text-3xl">
              What do you mean "No"?! 😒
            </h2>
            <p className="mt-3 text-sm font-semibold text-muted-foreground">
              You don't really have a choice here...
            </p>
            <div className="mt-8">
              <motion.button
                onClick={onNext}
                animate={{ scale: [1, 1.06, 1] }}
                transition={{ duration: 1.6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="rounded-full bg-primary px-10 py-4 text-lg font-bold text-primary-foreground shadow-xl"
              >
                Fine, let's cut it! 🙄
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
