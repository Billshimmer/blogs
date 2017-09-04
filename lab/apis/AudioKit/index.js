/**
 * AudioKit for recording & palying audio, give a video wave view.
 * @Author Zhou.Zeyong
 */

import React, {
  Component
} from 'react';
import {
  NativeModules,
  NativeEventEmitter
} from 'react-native';

const AudioRecorderManager = NativeModules.AudioRecorderManager;
const AudioPlayerManager = NativeModules.AudioPlayerManager;
const recorderNativeEventEmitter = new NativeEventEmitter(AudioRecorderManager);
const playerNativeEventEmitter = new NativeEventEmitter(AudioPlayerManager);

class AudioRecorder {
  constructor() {
    this._showRecorderView = true;
    this._recording = false;
    this.minRecordDuration = 1;
    AudioRecorderManager.showRecorderView(this._showRecorderView);
    this.listener = recorderNativeEventEmitter.addListener('LAB_AUDIO_recordProgress', this._recordProgress.bind(this));
  }

  /**
   * Add recordProgress method to instance of AudioRecorder to get current record
   * time progress
   * etc.
   * let audioRcorder = new AudioRecorder('test.m4a');
   * audioRcorder.recordProgress = this.recordProgress;
   * ...
   * recordProgress(progress){
   *  console.log(progress);
   * }
   * The value of progress is like:
   * {currentTime: 3.343673467636108, formattedCurrentTime: "00:04"}
   */
  _recordProgress(progress) {
    console.log(progress);
    this.currentTime = progress.currentTime;
    this.recordProgress && this.recordProgress(progress);
  }

  get showRecorderView() {
    return this._showRecorderView;
  }

  set showRecorderView(value) {
    AudioRecorderManager.showRecorderView(value);
    this._showRecorderView = value;
  }

  get isRecording() {
    return this._recording;
  }

  get audioFilePath() {
    return this._audioFilePath;
  }

  prepareRecording(filename) {
    this.filename = filename;
    AudioRecorderManager.prepareRecordingAtPath(filename).then((path) => {
      this._audioFilePath = path;
    }, (error) => {
      console.log(error);
    })
  }

  startRecording() {
    AudioRecorderManager.startRecording();
    this.isRecording = true;
  }

  pauseRecording() {
    AudioRecorderManager.stopRecording();
    this.isRecording = false;
  }

  /**
   * Thie operation will close the audio file, If you want do
   * some thing that will access this audio file, please
   * do it after finishRecording.
   * this.audioRecorder.finishRecording().then((filePath)=>{
   *  //TODO: some thing access the recorded audio file.
   *  // filePath is the file path of the recored audio file.
   * });
   */
  finishRecording() {
    return new Promise((resolve, reject) => {
      AudioRecorderManager.finishRecording().then((info) => {
        this.isRecording = false;
        if (this.currentTime < this.minRecordDuration) {
          reject(new Error('Too short'));
        } else {
          this.currentTime = 0;
          resolve(info);
        }
      }, (error) => {
        reject(error);
      })
    });
  }
}

class AudioPlayer {
  constructor() {
    this._playing = false;
    this._duration = 0;
    this._currentTime = 0;
    this._formattedDuration = "0.00";
    this._formattedCurrentTime = "0:00";
    playerNativeEventEmitter.addListener('LAB_AUDIO_playerDidFinish', this._playerDidFinish.bind(this));
    playerNativeEventEmitter.addListener('LAB_AUDIO_playProgress', this._playProgress.bind(this));
  }

  _playerDidFinish(notification) {
    // console.log(notification);
    this.playerDidFinish && this.playerDidFinish();
    this._playing=false;
  }

  _playProgress(progress) {
    console.log(progress.formattedCurrentTime);
    this.playProgress && this.playProgress(progress);
  }

  get playing() {
    return this._playing;
  }

  get duration() {
    return this._duration;
  }

  get currentTime() {
    return this._currentTime;
  }

  get formattedDuration() {
    return this._formattedDuration;
  }

  get formattedCurrentTime() {
    return this._formattedCurrentTime;
  }

  /**
   * Read a new audio file with local file system
   */
  prepareWithPath(filename) {
    this.filename = filename;
    return new Promise((resolve, reject) => {
      AudioPlayerManager.prepareWithPath(filename).then((info) => {
        this._duration = info.duration;
        this._currentTime = info.currentTime;
        this._formattedDuration = info.formattedDuration;
        this._formattedCurrentTime = info.formattedCurrentTime;
        resolve(info);
      }, (error) => {
        console.log(error);
        reject(error);
      })
    });
  }

  /**
   * Read a new audio file from web, It will cached local.
   * info.location is the path where the file is.
   */
  prepareWithUrl(url) {
    return new Promise((resolve, reject) => {
      AudioPlayerManager.prepareWithUrl(url).then((info) => {
        this._duration = info.duration;
        this._currentTime = info.currentTime;
        this._formattedDuration = info.formattedDuration;
        this._formattedCurrentTime = info.formattedCurrentTime;
        this.filename = info.location;
        resolve(info);
      }, (error) => {
        console.log(error);
        reject(error);
      })
    });
  }

  startPlaying() {
    AudioPlayerManager.startPlaying();
    this._playing = true;
  }

  pause() {
    AudioPlayerManager.pause();
  }
  //Android  在stopPlaying后会释放资源，需要重新prepare***
  stopPlaying() {
    AudioPlayerManager.stopPlaying();
    this._playing = false;
  }
}

export default {
  AudioRecorder,
  AudioPlayer
};
