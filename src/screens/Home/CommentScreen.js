// CommentsScreen.js - New file
import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  Keyboard,
  StyleSheet,
  StatusBar,
  Pressable,
} from 'react-native';
import Animated, { 
  FadeIn, 
  FadeInDown, 
  SlideInDown,
  FadeOut,
} from 'react-native-reanimated';
import IMG from '../../assets/Images';
import CustomText from '../../components/TextComponent';
import { FONTS_FAMILY } from '../../assets/Fonts';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import { apiGet, apiPost, apiPut, apiDelete } from '../../utils/Apis';
import urls from '../../config/urls';
import useLoader from '../../utils/LoaderHook';

const CommentsScreen = ({ route, navigation }) => {
  const { postId, isDarkMode, selector } = route.params;
  
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [selectedComment, setSelectedComment] = useState(null);
  const [showActionMenu, setShowActionMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editText, setEditText] = useState('');
  const editPressTimerRef = useRef(null);
  const { showLoader, hideLoader } = useLoader();

  useEffect(() => {
    fetchComments();
  }, [postId]);

  useEffect(() => {
    return () => {
      if (editPressTimerRef.current) {
        clearTimeout(editPressTimerRef.current);
      }
    };
  }, []);

  const fetchComments = async () => {
    try {
      const res = await apiGet(`${urls.getAllCommentofaPost}/${postId}`);
      setComments(res?.data || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleSendComment = async () => {
    if (commentText.trim()) {
      try {
        const data = { Post: postId, text: commentText.trim() };
        await apiPost(urls.sendCommentOnPost, data);
        setCommentText('');
        fetchComments();
      } catch (error) {
        console.error('Error sending comment:', error);
      }
    }
  };

  const handleEditPress = (comment) => {
    Keyboard.dismiss();
    if (editPressTimerRef.current) {
      clearTimeout(editPressTimerRef.current);
    }

    editPressTimerRef.current = setTimeout(() => {
      setIsEditing(true);
      setEditingCommentId(comment._id);
      setEditText(comment.text);
      setShowActionMenu(false);
    }, 100);
  };

  const handleEditCancel = () => {
    Keyboard.dismiss();
    setIsEditing(false);
    setEditingCommentId(null);
    setEditText('');
  };

  const handleEditSave = async () => {
    if (editText.trim()) {
      try {
        Keyboard.dismiss();
        const data = { text: editText.trim() };
        await apiPut(`${urls.editComment}/${editingCommentId}`, data);
        setIsEditing(false);
        setEditingCommentId(null);
        setEditText('');
        fetchComments();
      } catch (error) {
        console.error('Error editing comment:', error);
      }
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      showLoader();
      await apiDelete(`/api/user/DeleteComment/${commentId}`);
      setShowActionMenu(false);
      fetchComments();
    } catch (error) {
      console.error('Error deleting comment:', error);
    } finally {
      hideLoader();
    }
  };

  const handleLongPress = (comment) => {
    Keyboard.dismiss();
    setSelectedComment(comment);
    setShowActionMenu(true);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.3)',
    },
    backdrop: {
      flex: 1,
    },
    modalContent: {
      height: '90%',
      backgroundColor: isDarkMode ? '#1a1a1a' : '#fff',
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      paddingTop: 8,
    },
    dragHandle: {
      height: 5,
      width: 60,
      backgroundColor: isDarkMode ? '#555' : '#ccc',
      borderRadius: 3,
      alignSelf: 'center',
      marginBottom: 10,
    },
    header: {
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingBottom: 12,
    },
    headerTitle: {
      fontFamily: FONTS_FAMILY.SourceSans3_Bold,
      fontSize: 18,
      color: isDarkMode ? 'white' : 'black',
    },
    divider: {
      height: 0.5,
      backgroundColor: isDarkMode ? '#333' : '#e0e0e0',
      width: '100%',
      marginTop: 10,
    },
    commentItem: {
      flexDirection: 'row',
      marginBottom: 20,
      paddingHorizontal: 16,
    },
    commentAvatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      marginRight: 10,
    },
    commentContent: {
      flex: 1,
    },
    commentUsername: {
      fontWeight: 'bold',
      fontSize: 14,
      marginBottom: 4,
      color: isDarkMode ? 'white' : 'black',
    },
    commentText: {
      fontSize: 14,
      lineHeight: 18,
      color: isDarkMode ? '#ddd' : '#333',
    },
    emptyText: {
      alignSelf: 'center',
      fontFamily: FONTS_FAMILY.SourceSans3_Medium,
      color: isDarkMode ? '#666' : '#999',
      marginTop: 40,
    },
    actionMenu: {
      position: 'absolute',
      backgroundColor: isDarkMode ? '#2a2a2a' : '#fff',
      borderRadius: 16,
      padding: 8,
      minWidth: 140,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
      top: '40%',
      right: 20,
    },
    actionMenuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 16,
      gap: 10,
    },
    actionMenuText: {
      fontWeight: '500',
      fontSize: 14,
    },
    actionMenuDivider: {
      height: 0.5,
      backgroundColor: isDarkMode ? '#444' : '#e0e0e0',
      marginHorizontal: 12,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 12,
      paddingBottom: 20,
      borderTopWidth: 1,
      borderColor: isDarkMode ? '#333' : '#e0e0e0',
      backgroundColor: isDarkMode ? '#1a1a1a' : '#fff',
    },
    input: {
      flex: 1,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 20,
      fontSize: 14,
      maxHeight: 80,
      backgroundColor: isDarkMode ? '#2a2a2a' : '#f5f5f5',
      color: isDarkMode ? 'white' : 'black',
    },
    inputEditing: {
      borderWidth: 1.5,
      borderColor: '#0A84FF',
    },
    buttonContainer: {
      flexDirection: 'row',
      gap: 8,
      marginLeft: 8,
    },
    cancelButton: {
      paddingHorizontal: 12,
      paddingVertical: 8,
    },
    sendButton: {
      paddingHorizontal: 12,
      paddingVertical: 8,
    },
    buttonText: {
      fontWeight: 'bold',
      fontSize: 14,
    },
  });

  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor="transparent"
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        translucent
      />
      
      {/* Backdrop - Close on tap */}
      <Pressable 
        style={styles.backdrop} 
        onPress={() => navigation.goBack()}
      />

      {/* Modal Content */}
      <Animated.View 
        entering={SlideInDown.duration(300)}
        exiting={FadeOut.duration(200)}
        style={styles.modalContent}
      >
        {/* Drag Handle */}
        <View style={styles.dragHandle} />
        
        {/* Header */}
        <Animated.View entering={FadeIn.delay(100)} style={styles.header}>
          <Text style={styles.headerTitle}>Comments</Text>
          <View style={styles.divider} />
        </Animated.View>

        {/* Comments List */}
        <FlatList
          data={comments}
          keyExtractor={(item, index) => item._id || index.toString()}
          renderItem={({ item, index }) => (
            <Animated.View entering={index < 8 ? FadeInDown.delay(index * 30).duration(220) : undefined}>
              <TouchableOpacity
                onLongPress={() => handleLongPress(item)}
                activeOpacity={0.7}
                style={styles.commentItem}
              >
                <Image
                  source={
                    item?.User?.Image 
                      ? { uri: item?.User?.Image } 
                      : IMG.MessageProfile
                  }
                  style={styles.commentAvatar}
                />
                <View style={styles.commentContent}>
                  <Text style={styles.commentUsername}>
                    {item?.User?.UserName || 'User'}
                  </Text>
                  <Text style={styles.commentText}>
                    {item?.text || ''}
                  </Text>
                </View>
              </TouchableOpacity>
            </Animated.View>
          )}
          contentContainerStyle={{ paddingTop: 8, paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          initialNumToRender={8}
          maxToRenderPerBatch={8}
          windowSize={7}
          removeClippedSubviews
          ListEmptyComponent={
            <Text style={styles.emptyText}>No Comments Yet!</Text>
          }
        />

        {/* Action Menu (Edit/Delete) */}
        {showActionMenu && (
          <Animated.View 
            entering={FadeIn.duration(200)}
            exiting={FadeOut.duration(150)}
            style={styles.actionMenu}
          >
            <Pressable
              style={{ position: 'absolute', top: -1000, left: -1000, right: -1000, bottom: -1000 }}
              onPress={() => setShowActionMenu(false)}
            />
            
            {/* Edit Option */}
            <TouchableOpacity
              style={styles.actionMenuItem}
              onPress={() => handleEditPress(selectedComment)}
            >
              <Feather
                name="edit-3"
                color="#0A84FF"
                size={16}
              />
              <Text style={[
                styles.actionMenuText,
                { color: isDarkMode ? 'white' : 'black' }
              ]}>
                Edit
              </Text>
            </TouchableOpacity>

            <View style={styles.actionMenuDivider} />

            {/* Delete Option */}
            <TouchableOpacity
              style={styles.actionMenuItem}
              onPress={() => handleDeleteComment(selectedComment._id)}
            >
              <AntDesign name="delete" color="red" size={16} />
              <Text style={[styles.actionMenuText, { color: 'red' }]}>
                Delete
              </Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* Input Box */}
        <View style={styles.inputContainer}>
          <TextInput
            placeholder={isEditing ? "Edit comment..." : "Add a comment..."}
            placeholderTextColor={isDarkMode ? '#777' : '#999'}
            style={[
              styles.input,
              isEditing && styles.inputEditing
            ]}
            value={isEditing ? editText : commentText}
            onChangeText={isEditing ? setEditText : setCommentText}
            multiline={true}
            maxLength={500}
          />
          
          {isEditing ? (
            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={handleEditCancel}
              >
                <Text style={[styles.buttonText, { color: '#999' }]}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.sendButton}
                onPress={handleEditSave}
              >
                <Text style={[styles.buttonText, { color: '#0A84FF' }]}>
                  Save
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity 
              style={styles.sendButton}
              onPress={handleSendComment}
            >
              <Text style={[styles.buttonText, { color: '#0A84FF' }]}>
                Post
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>
    </View>
  );
};

export default CommentsScreen;