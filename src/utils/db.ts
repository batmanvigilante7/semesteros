// SemesterOS local-first database wrapper using IndexedDB
// Ideal for storing heavy assets (Base64 PDFs, image attachments, videos)

export interface KnowledgeFile {
  id: string
  title: string
  type: 'pdf' | 'video' | 'link' | 'note' | 'image' | 'concept' | 'question' | 'lab' | 'assignment'
  courseId: string
  size: string
  dateAdded: string
  subject: string
  tags: string[]
  isFavorite: boolean
  isBookmarked: boolean
  url: string
  subCategory: 'notes' | 'pdfs' | 'images' | 'videos' | 'concepts' | 'questions' | 'bookmarks' | 'labs' | 'assignments'
}

class AcademicDB {
  private dbName = 'SemesterOS_DB_v2'
  private dbVersion = 1

  private getDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion)
      
      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result)
      
      request.onupgradeneeded = () => {
        const db = request.result
        if (!db.objectStoreNames.contains('files')) {
          db.createObjectStore('files', { keyPath: 'id' })
        }
      }
    })
  }

  async saveFile(file: KnowledgeFile): Promise<void> {
    const db = await this.getDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('files', 'readwrite')
      const store = transaction.objectStore('files')
      const request = store.put(file)
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  async getFiles(): Promise<KnowledgeFile[]> {
    const db = await this.getDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('files', 'readonly')
      const store = transaction.objectStore('files')
      const request = store.getAll()
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  async deleteFile(id: string): Promise<void> {
    const db = await this.getDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('files', 'readwrite')
      const store = transaction.objectStore('files')
      const request = store.delete(id)
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }
}

export const db = new AcademicDB()
