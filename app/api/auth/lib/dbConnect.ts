import mongoose from 'mongoose'

interface Connection {
  isConnected?: number
}

const connection: Connection = {}

async function dbConnect(): Promise<void> {
  // Check if we have a connection to the database
  if (connection.isConnected) {
    return
  }

  // If not, create a new connection
  const mongoUri = process.env.MONGODB_URI

  if (!mongoUri) {
    throw new Error('Please define the MONGODB_URI environment variable')
  }

  try {
    const db = await mongoose.connect(mongoUri)
    connection.isConnected = db.connections[0].readyState
    console.log('MongoDB connected successfully')
  } catch (error) {
    console.error('MongoDB connection error:', error)
    throw error
  }
}

export default dbConnect
