# 🗄️ SQLite Setup for Vercel

## ✅ **Perfect for Vercel Free Tier!**

SQLite is ideal for Vercel because:
- ✅ **No external database** required
- ✅ **File-based** - works with Vercel's file system
- ✅ **Fast queries** with proper indexing
- ✅ **Free tier compatible**

## 🚀 **Setup Instructions**

### **1. Install Dependencies**
```bash
npm install
```

### **2. Setup Database**
```bash
npm run setup-db
```

This will:
- Create `prompts.db` SQLite database
- Import all 1,767 prompts from JSON
- Create indexes for fast queries
- Show category breakdown

### **3. Development**
```bash
npm run dev
```

### **4. Deploy to Vercel**
```bash
vercel
```

## 📊 **Database Structure**

```sql
CREATE TABLE prompts (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  fullPrompt TEXT NOT NULL,
  category TEXT NOT NULL,
  tags TEXT NOT NULL,           -- JSON string
  compatibleModels TEXT NOT NULL, -- JSON string
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL,
  source TEXT
);

-- Indexes for performance
CREATE INDEX idx_category ON prompts(category);
CREATE INDEX idx_title ON prompts(title);
CREATE INDEX idx_tags ON prompts(tags);
```

## 🎯 **API Endpoints**

| Endpoint | Description | Parameters |
|----------|-------------|------------|
| `GET /api/prompts` | Get all prompts | `category`, `search`, `limit`, `offset` |
| `GET /api/prompts/[id]` | Get single prompt | `id` |
| `GET /api/statistics` | Get statistics | - |
| `GET /api/categories` | Get categories | - |

## 📈 **Performance Benefits**

| Feature | JSON File | SQLite |
|---------|-----------|--------|
| **File Size** | 18.3 MB | ~5 MB |
| **Query Speed** | Slow (client-side) | Fast (server-side) |
| **Memory Usage** | High | Low |
| **Search** | Client-side filter | Database index |
| **Pagination** | Manual slicing | SQL LIMIT/OFFSET |

## 🛠️ **Usage Examples**

### **Get All Prompts**
```typescript
const prompts = await getAllPrompts();
```

### **Search Prompts**
```typescript
const results = await searchPrompts('code review');
```

### **Filter by Category**
```typescript
const systemPrompts = await getPromptsByCategory('System Prompts');
```

### **Get Statistics**
```typescript
const stats = await getStatistics();
// Returns: { totalPrompts: 1767, categories: {...} }
```

## 🎉 **Ready for Production!**

Your prompt library now uses:
- ✅ **SQLite database** with 1,767 prompts
- ✅ **Fast server-side queries**
- ✅ **Proper indexing** for performance
- ✅ **Vercel-compatible** architecture
- ✅ **API routes** for all operations

**Deploy and enjoy your high-performance prompt library!** 🚀
