const mongoose = require('mongoose');

async function clearAllPosts() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/citizensPortal');
    console.log('Connected to MongoDB');

    // Define Post model
    const postSchema = new mongoose.Schema({
      description: String,
      location: String,
      officials: [String],
      image: String,
      score: Number,
      views: Number,
      authorityViewed: Boolean,
      resolution: {
        beforeImage: String,
        afterImage: String,
        awaitingCitizenConfirmation: Boolean
      },
      citizenConfirmed: Boolean,
      createdAt: Date,
      ownerId: String
    });

    const Post = mongoose.model('Post', postSchema);

    // Count posts before deletion
    const countBefore = await Post.countDocuments();
    console.log(`Posts before deletion: ${countBefore}`);

    // Delete all posts
    const result = await Post.deleteMany({});
    console.log(`Deleted ${result.deletedCount} posts`);

    // Count posts after deletion
    const countAfter = await Post.countDocuments();
    console.log(`Posts after deletion: ${countAfter}`);

    console.log('✅ All posts cleared successfully!');
  } catch (error) {
    console.error('❌ Error clearing posts:', error);
  } finally {
    // Close connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

// Run the function
clearAllPosts(); 