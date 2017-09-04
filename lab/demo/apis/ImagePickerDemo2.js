import React from 'react';
import {
  
  StyleSheet,
  Text,
  View,
  PixelRatio,
  TouchableOpacity,
  Image,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';

import {
  Page,
  requireComp,
} from 'lab4';

import SimplePage from 'lab4/demo/SimplePage';
import ImagePicker from 'lab-image-picker';

export default class ImagePickerDemo2 extends SimplePage {

  state = {
    avatarSource: {uri:'./img/icon1.png'},
    videoSource: null,
  };
  /*selectPhotoTapped() {
    const options = {
      quality: 1.0,
      maxWidth: 500,
      maxHeight: 500,
      storageOptions: {
        skipBackup: true
      }
    };
    ImagePicker.showImagePicker(options, (error, response) => {
      console.log('error = ', error, 'Response = ', response);
      if (error) {
        if (error.code === 'cancel') {
          console.log('User cancelled photo picker');
        } else {
          console.log('ImagePicker Error: ', response.error);
        }
        return;
      }

      this.setState({
        avatarSource: {uri: response.uri},
      });
    });
  }*/
  /*selectVideoTapped() {
    const options = {
      title: 'Video Picker',
      takePhotoButtonTitle: 'Take Video...',
      mediaType: 'video',
      videoQuality: 'medium'
    };

    ImagePicker.showImagePicker(options, (error, response) => {
      console.log('error = ', error, 'Response = ', response);

      if (error) {
        if (error.code === 'cancel') {
          console.log('User cancelled photo picker');
        } else {
          console.log('ImagePicker Error: ', response.error);
        }
        return;
      }

      this.setState({
        videoSource: response.uri,
      });
    });
  }*/

  testselectSingleImage(){   //选择单张图片
    const options = {
      quality:0.8,
      storageOptions: {
        skipBackup: true
      }
    };
    ImagePicker.showImagePicker(options,(error,data)=>{
      if (!error) {
        console.log("width:"+data.width+" height:"+data.height+" fileSize:"+data.fileSize);
        this.setState({
          //avatarUri:{uri:data.uri},
          avatarSource:data,
        });

      }else{
        Alert.alert("发生错误:"+error.message);
      }
      });
  }
  testselectSingleImageWithCrop(){   //选择单张裁剪图片
    const options = {
      cropping:true,
      cropAspectRatio:2.0,
      cropWidth:300,
      cropHeight:300,
      storageOptions: {
        skipBackup: true
      }
    };
    ImagePicker.showImagePicker(options,(error,data)=>{

      if (!error) {
        console.log("width:"+data.width+" height:"+data.height+" fileSize:"+data.fileSize);
        this.setState({
          avatarUri:{uri:data.uri},
        });
      }else{
        Alert.alert("发生错误:"+error.message);
      }
    });
  }
  testselectMultiImage(){  //选择多张
    const options = {
      multiple:true,
      quality: 1.0,
      maxWidth: 500,
      maxHeight: 500,
      maxSize:1,
      cropping:true,
      storageOptions: {
        skipBackup: true
      }
    };
    ImagePicker.showImagePicker(options,(error,data)=>{
      if (!error) {
        this.setState({
          avatarSource:data[0],
        });
      }else{
        Alert.alert("发生错误:"+error.message);
      }
    });
  }


  renderItems(images){
    if (images!==null) {
      return images.map((item,i)=>{
        console.log("width:"+item.width+" height:"+item.height+" fileSize:"+item.fileSize);
        return(
          <View key={i}>
            <Image source={{uri:item.uri}} style={{width:100,height:100}}></Image>
          </View>
        );
      });
    }else{
      return <Text>当前无图片</Text>
    }


  }
  renderTest() {
    return (

      <ScrollView>
          <View style={styles.container}>
          {
            Object.prototype.toString.call(this.state.avatarSource)==='[object Array]'?
            this.renderItems(this.state.avatarSource):
            <Image style={styles.avatar} source={{uri:this.state.avatarSource.uri}} />
          }
          </View>
      </ScrollView>

    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    margin:50,
  },
  avatarContainer: {
    borderColor: '#9B9B9B',
    borderWidth: 1 / PixelRatio.get(),
    justifyContent: 'center',
    alignItems: 'center'
  },
  avatar: {
    borderRadius: 75,
    width: 150,
    height: 150
  }
});
