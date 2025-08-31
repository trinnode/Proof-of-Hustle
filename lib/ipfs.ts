import axios from 'axios'
import { PINATA_JWT } from './constants'

export interface IPFSUploadResult {
  ipfsHash: string
  url: string
  fileHashes: string[] // optional: hashes of individual files
}

export async function uploadToIPFS(files: File[], description: string): Promise<IPFSUploadResult> {
  try {
    const fileHashes: string[] = []

    // Upload each file individually
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const formData = new FormData()
      formData.append('file', file, file.name)

      const pinataMetadata = JSON.stringify({
        name: `ProofOfHustle_${Date.now()}_${file.name}`,
        keyvalues: {
          description: description.substring(0, 100),
          timestamp: Date.now().toString(),
          index: i.toString()
        }
      })
      formData.append('pinataMetadata', pinataMetadata)

      const pinataOptions = JSON.stringify({ cidVersion: 1 })
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

      if (!response.data?.IpfsHash) {
        throw new Error(`Failed to upload file: ${file.name}`)
      }

      fileHashes.push(response.data.IpfsHash)
    }

    // Now create a metadata JSON with all file hashes
    const metadata = {
      description,
      timestamp: Date.now(),
      files: files.map((f, idx) => ({
        name: f.name,
        size: f.size,
        type: f.type,
        ipfsHash: fileHashes[idx]
      }))
    }

    const metadataBlob = new Blob([JSON.stringify(metadata, null, 2)], { type: 'application/json' })
    const metadataForm = new FormData()
    metadataForm.append('file', metadataBlob, 'metadata.json')

    const metadataPinataMetadata = JSON.stringify({
      name: `ProofOfHustle_Metadata_${Date.now()}`,
      keyvalues: {
        description: description.substring(0, 100),
        timestamp: Date.now().toString()
      }
    })
    metadataForm.append('pinataMetadata', metadataPinataMetadata)

    const metadataPinataOptions = JSON.stringify({ cidVersion: 1 })
    metadataForm.append('pinataOptions', metadataPinataOptions)

    const metadataResponse = await axios.post(
      'https://api.pinata.cloud/pinning/pinFileToIPFS',
      metadataForm,
      {
        maxBodyLength: Infinity,
        headers: {
          'Content-Type': `multipart/form-data`,
          'Authorization': `Bearer ${PINATA_JWT}`
        }
      }
    )

    if (!metadataResponse.data?.IpfsHash) {
      throw new Error('Failed to upload metadata to IPFS')
    }

    return {
      ipfsHash: metadataResponse.data.IpfsHash,
      url: `https://gateway.pinata.cloud/ipfs/${metadataResponse.data.IpfsHash}`,
      fileHashes
    }

  } catch (error: any) {
    console.error('IPFS upload error:', error)
    throw new Error('Failed to upload to IPFS')
  }
}

export function getIPFSUrl(hash: string): string {
  return `https://gateway.pinata.cloud/ipfs/${hash}`
}
