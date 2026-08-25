package com.differentfreelancer.jumprunner;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.graphics.Color;
import android.os.Bundle;
import android.util.Log;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.TextView;

public class MainActivity extends Activity {
    private static final String TAG = "JumpRunner";
    private WebView webView;

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        applyStableFullscreen();

        try {
            webView = new WebView(this);
            webView.setLayoutParams(new ViewGroup.LayoutParams(
                    ViewGroup.LayoutParams.MATCH_PARENT,
                    ViewGroup.LayoutParams.MATCH_PARENT));

            WebSettings settings = webView.getSettings();
            settings.setJavaScriptEnabled(true);
            settings.setDomStorageEnabled(true);
            settings.setAllowFileAccess(true);
            settings.setAllowContentAccess(false);
            settings.setMediaPlaybackRequiresUserGesture(false);
            settings.setSupportZoom(false);
            settings.setBuiltInZoomControls(false);
            settings.setDisplayZoomControls(false);
            settings.setBlockNetworkLoads(true);

            WebView.setWebContentsDebuggingEnabled(false);
            webView.setBackgroundColor(Color.BLACK);
            webView.setOverScrollMode(View.OVER_SCROLL_NEVER);
            webView.setFitsSystemWindows(false);
            webView.setWebViewClient(new WebViewClient());

            setContentView(webView);
            webView.loadUrl("file:///android_asset/index.html");
            scheduleViewportSync();
        } catch (Throwable error) {
            Log.e(TAG, "Unable to initialize game WebView", error);
            disposeWebView();
            showStartupFailure(error);
        }
    }

    private void applyStableFullscreen() {
        try {
            getWindow().setStatusBarColor(Color.BLACK);
            getWindow().setNavigationBarColor(Color.BLACK);
            getWindow().getDecorView().setSystemUiVisibility(
                    View.SYSTEM_UI_FLAG_FULLSCREEN
                            | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                            | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
                            | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                            | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                            | View.SYSTEM_UI_FLAG_LAYOUT_STABLE);
        } catch (Throwable error) {
            Log.w(TAG, "Fullscreen setup skipped", error);
        }
    }

    private void showStartupFailure(Throwable error) {
        TextView fallback = new TextView(this);
        fallback.setBackgroundColor(Color.BLACK);
        fallback.setTextColor(Color.WHITE);
        fallback.setGravity(Gravity.CENTER);
        fallback.setPadding(48, 48, 48, 48);
        fallback.setTextSize(18f);
        String type = error == null ? "unknown" : error.getClass().getSimpleName();
        fallback.setText("Jump Runner could not start the game engine.\n\nError: " + type
                + "\n\nPlease update Android System WebView / Chrome, then reopen the app.");
        setContentView(fallback);
    }

    private void safeDispatchEvent(String eventName) {
        if (webView == null) return;
        try {
            webView.evaluateJavascript(
                    "window.dispatchEvent(new Event('" + eventName + "'))",
                    null);
        } catch (Throwable error) {
            Log.w(TAG, "Unable to dispatch " + eventName, error);
        }
    }

    private void scheduleViewportSync() {
        if (webView == null) return;
        Runnable sync = () -> {
            if (webView == null) return;
            try {
                webView.requestLayout();
                webView.evaluateJavascript(
                        "window.dispatchEvent(new Event('resize'));" +
                                "if(window.visualViewport){window.visualViewport.dispatchEvent(new Event('resize'));}",
                        null);
            } catch (Throwable error) {
                Log.w(TAG, "Viewport sync skipped", error);
            }
        };
        webView.postDelayed(sync, 80);
        webView.postDelayed(sync, 240);
    }

    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        if (hasFocus) {
            applyStableFullscreen();
            scheduleViewportSync();
        }
    }

    @Override
    public void onBackPressed() {
        if (webView != null) {
            safeDispatchEvent("jumprunnerback");
        } else {
            super.onBackPressed();
        }
    }

    @Override
    protected void onPause() {
        if (webView != null) {
            safeDispatchEvent("jumprunnerpause");
            try {
                webView.onPause();
            } catch (Throwable error) {
                Log.w(TAG, "WebView pause skipped", error);
            }
        }
        super.onPause();
    }

    @Override
    protected void onResume() {
        super.onResume();
        applyStableFullscreen();
        if (webView != null) {
            try {
                webView.onResume();
            } catch (Throwable error) {
                Log.w(TAG, "WebView resume skipped", error);
            }
            safeDispatchEvent("jumprunnerresume");
            scheduleViewportSync();
        }
    }

    private void disposeWebView() {
        if (webView == null) return;
        try {
            webView.loadUrl("about:blank");
            webView.stopLoading();
            webView.clearHistory();
            webView.removeAllViews();
            webView.destroy();
        } catch (Throwable error) {
            Log.w(TAG, "WebView cleanup skipped", error);
        } finally {
            webView = null;
        }
    }

    @Override
    protected void onDestroy() {
        disposeWebView();
        super.onDestroy();
    }
}
