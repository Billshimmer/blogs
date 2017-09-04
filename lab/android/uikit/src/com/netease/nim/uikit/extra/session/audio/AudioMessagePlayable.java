package com.netease.nim.uikit.extra.session.audio;

import com.hyphenate.chat.EMVoiceMessageBody;
import com.netease.nim.uikit.common.media.audioplayer.Playable;
import com.netease.nimlib.sdk.msg.model.IMMessage;


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
		return ((EMVoiceMessageBody) message.getAttachment().getEMMessageBody()).getLength();
	}

	@Override
	public String getPath() {
		return ((EMVoiceMessageBody) message.getAttachment().getEMMessageBody()).getLocalUrl();
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
