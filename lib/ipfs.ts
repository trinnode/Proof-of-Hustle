import axios from 'axios'
import { PINATA_JWT } from './constants'

export interface IPFSUploadResult {
  ipfsHash: string
  url: string
}

export async function uploadToIPFS(files: File[], description: string): Promise<IPFSUploadResult> {
  try {
    const formData = new FormData()
    
    // Create metadata file
    const metadata = {
      description,
      timestamp: Date.now(),
      files: files.map(f => ({ name: f.name, size: f.size, type: f.type }))
    }
    
    const metadataBlob = new Blob([JSON.stringify(metadata, null, 2)], { 
      type: 'application/json' 
    })
    formData.append('file', metadataBlob, 'metadata.json')
    
    // Add all files
    files.forEach((file, index) => {
      formData.append('file', file, `file_${index}_${file.name}`)
    })
    
    const pinataMetadata = JSON.stringify({
      name: `ProofOfHustle_${Date.now()}`,
      keyvalues: {
        description: description.substring(0, 100),
        timestamp: Date.now().toString()
      }
    })
    formData.append('pinataMetadata', pinataMetadata)
    
    const pinataOptions = JSON.stringify({
      cidVersion: 0,
    })
    formData.append('pinataOptions', pinataOptions)

    const response = await axios.post(
      'https://api.pinata.cloud/pinning/pinFileToIPFS',
      formData,
      {
        maxBodyLength: Infinity,
        headers: {
          'Content-Type': `multipart/form-data`,
          'Authorization': `Bearer ${PINATA_JWT}`
        }
      }
    )

    const ipfsHash = response.data.IpfsHash
    return {
      ipfsHash,
      url: `https://gateway.pinata.cloud/ipfs/${ipfsHash}`
    }
  } catch (error) {
    console.error('IPFS upload error:', error)
    throw new Error('Failed to upload to IPFS')
  }
}

export function getIPFSUrl(hash: string): string {
  return `https://gateway.pinata.cloud/ipfs/${hash}`
}