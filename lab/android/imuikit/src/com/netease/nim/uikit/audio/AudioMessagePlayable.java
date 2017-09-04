package com.netease.nim.uikit.audio;

import com.hyphenate.chat.EMVoiceMessageBody;
import com.netease.nim.uikit.common.media.audioplayer.Playable;
import com.netease.nim.uikit.system.IMMessage;


public class AudioMessagePlayable implements Playable {

	private IMMessage message;

	public IMMessage getMessage() {
		return message;
	}

	public AudioMessagePlayable(IMMessage playableMessage) {
		this.message = playableMessage;
	}

	@Override
	public long getDuration() {
		return ((EMVoiceMessageBody) message.getAttachment()).getLength();
	}

	@Override
	public String getPath() {
		return ((EMVoiceMessageBody) message.getAttachment()).getLocalUrl();
	}

	@Override
	public boolean isAudioEqual(Playable audio) {
		if (AudioMessagePlayable.class.isInstance(audio)) {
			return message.isTheSame(((AudioMessagePlayable) audio).getMessage());
		} else {
			return false;
		}
	}
}
