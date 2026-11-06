
import React from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  ViewStyle,
} from "react-native";
import { Colors, Spacing } from "../../theme";

type ScreenContainerProps = {
  children: React.ReactNode;
  scrollable?: boolean;
  padding?: number;
  style?: ViewStyle;
};

export default function ScreenContainer({
  children,
  scrollable = true,
  padding = Spacing.lg,
  style,
}: ScreenContainerProps) {
  if (scrollable) {
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.content,
          { padding },
          style,
        ]}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    );
  }

  return (
    <View
      style={[
        styles.container,
        styles.content,
        { padding },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flexGrow: 1,
  },
});
