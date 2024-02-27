package de.bkm.kulturpass.textinput;

import android.content.Context;
import android.graphics.Rect;
import android.view.View;

import com.facebook.react.views.textinput.ReactEditText;

public class RCTEditText extends ReactEditText {
    public RCTEditText(Context context) {
        super(context);
    }

    @Override
    public boolean requestFocus(int direction, Rect previouslyFocusedRect) {
        if (direction == View.FOCUS_FORWARD || direction == View.FOCUS_BACKWARD) {
            this.requestFocusFromJS();
        }
        return super.requestFocus(direction, previouslyFocusedRect);
    }
}