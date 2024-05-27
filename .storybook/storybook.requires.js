/* do not change this file, it is auto generated by storybook. */

import {
  configure,
  addDecorator,
  addParameters,
  addArgsEnhancer,
  clearDecorators,
} from "@storybook/react-native";

global.STORIES = [
  {
    titlePrefix: "",
    directory: "./src",
    files: "**/*.stories.?(ts|tsx|js|jsx)",
    importPathMatcher:
      "^\\.[\\\\/](?:src(?:\\/(?!\\.)(?:(?:(?!(?:^|\\/)\\.).)*?)\\/|\\/|$)(?!\\.)(?=.)[^/]*?\\.stories\\.(?:ts|tsx|js|jsx)?)$",
  },
];

import "@storybook/addon-ondevice-controls/register";
import "@storybook/addon-ondevice-actions/register";

import { argsEnhancers } from "@storybook/addon-actions/dist/modern/preset/addArgs";

import { decorators, parameters } from "./preview";

if (decorators) {
  if (__DEV__) {
    // stops the warning from showing on every HMR
    require("react-native").LogBox.ignoreLogs([
      "`clearDecorators` is deprecated and will be removed in Storybook 7.0",
    ]);
  }
  // workaround for global decorators getting infinitely applied on HMR, see https://github.com/storybookjs/react-native/issues/185
  clearDecorators();
  decorators.forEach((decorator) => addDecorator(decorator));
}

if (parameters) {
  addParameters(parameters);
}

try {
  argsEnhancers.forEach((enhancer) => addArgsEnhancer(enhancer));
} catch {}

const getStories = () => {
  return {
    "./src/components/alert/alert.stories.tsx": require("../src/components/alert/alert.stories.tsx"),
    "./src/components/badge/badge.stories.tsx": require("../src/components/badge/badge.stories.tsx"),
    "./src/components/bullet-list-item/bullet-list-item.stories.tsx": require("../src/components/bullet-list-item/bullet-list-item.stories.tsx"),
    "./src/components/button/button.stories.tsx": require("../src/components/button/button.stories.tsx"),
    "./src/components/circle-icon-button/circle-icon-button.stories.tsx": require("../src/components/circle-icon-button/circle-icon-button.stories.tsx"),
    "./src/components/copy-to-clipboard/copy-to-clipboard.stories.tsx": require("../src/components/copy-to-clipboard/copy-to-clipboard.stories.tsx"),
    "./src/components/e-mail-link/e-mail-link.stories.tsx": require("../src/components/e-mail-link/e-mail-link.stories.tsx"),
    "./src/components/favorite-button/favorite-button.stories.tsx": require("../src/components/favorite-button/favorite-button.stories.tsx"),
    "./src/components/form-fields/date-form-field.stories.tsx": require("../src/components/form-fields/date-form-field.stories.tsx"),
    "./src/components/form-fields/password-form-field.stories.tsx": require("../src/components/form-fields/password-form-field.stories.tsx"),
    "./src/components/form-fields/text-form-field-group.stories.tsx": require("../src/components/form-fields/text-form-field-group.stories.tsx"),
    "./src/components/form-fields/text-form-field.stories.tsx": require("../src/components/form-fields/text-form-field.stories.tsx"),
    "./src/components/html-text/html-text.stories.tsx": require("../src/components/html-text/html-text.stories.tsx"),
    "./src/components/info-box/info-box.stories.tsx": require("../src/components/info-box/info-box.stories.tsx"),
    "./src/components/link-text/link-text.stories.tsx": require("../src/components/link-text/link-text.stories.tsx"),
    "./src/components/list-item/list-item.stories.tsx": require("../src/components/list-item/list-item.stories.tsx"),
    "./src/components/loading-indicator/loading-indicator-overlay.stories.tsx": require("../src/components/loading-indicator/loading-indicator-overlay.stories.tsx"),
    "./src/components/modal-screen/modal-screen-header.stories.tsx": require("../src/components/modal-screen/modal-screen-header.stories.tsx"),
    "./src/components/screen/screen.stories.tsx": require("../src/components/screen/screen.stories.tsx"),
    "./src/components/svg-image/svg-image.stories.tsx": require("../src/components/svg-image/svg-image.stories.tsx"),
    "./src/components/tab-bar-icon/tab-bar-icon.stories.tsx": require("../src/components/tab-bar-icon/tab-bar-icon.stories.tsx"),
    "./src/components/text-with-icon/text-with-icon.stories.tsx": require("../src/components/text-with-icon/text-with-icon.stories.tsx"),
    "./src/components/try-again-button/try-again-button.stories.tsx": require("../src/components/try-again-button/try-again-button.stories.tsx"),
    "./src/features/delta-onboarding/screens/editorial-email-consent-modal-screen.stories.tsx": require("../src/features/delta-onboarding/screens/editorial-email-consent-modal-screen.stories.tsx"),
    "./src/features/eid-verification/components/pin-input.stories.tsx": require("../src/features/eid-verification/components/pin-input.stories.tsx"),
    "./src/features/eid-verification/screens/eid-can-screen.stories.tsx": require("../src/features/eid-verification/screens/eid-can-screen.stories.tsx"),
    "./src/features/eid-verification/screens/eid-change-pin-completion-screen.stories.tsx": require("../src/features/eid-verification/screens/eid-change-pin-completion-screen.stories.tsx"),
    "./src/features/eid-verification/screens/eid-new-pin-screen.stories.tsx": require("../src/features/eid-verification/screens/eid-new-pin-screen.stories.tsx"),
    "./src/features/eid-verification/screens/eid-nfc-not-supported-screen.stories.tsx": require("../src/features/eid-verification/screens/eid-nfc-not-supported-screen.stories.tsx"),
    "./src/features/eid-verification/screens/eid-pin-screen.stories.tsx": require("../src/features/eid-verification/screens/eid-pin-screen.stories.tsx"),
    "./src/features/eid-verification/screens/eid-puk-inoperative-screen.stories.tsx": require("../src/features/eid-verification/screens/eid-puk-inoperative-screen.stories.tsx"),
    "./src/features/eid-verification/screens/eid-puk-screen.stories.tsx": require("../src/features/eid-verification/screens/eid-puk-screen.stories.tsx"),
    "./src/features/eid-verification/screens/eid-transport-pin-screen.stories.tsx": require("../src/features/eid-verification/screens/eid-transport-pin-screen.stories.tsx"),
    "./src/features/favorites/components/favorites-list-item.stories.tsx": require("../src/features/favorites/components/favorites-list-item.stories.tsx"),
    "./src/features/preferences/components/preferences.stories.tsx": require("../src/features/preferences/components/preferences.stories.tsx"),
    "./src/features/product-detail/components/chip.stories.tsx": require("../src/features/product-detail/components/chip.stories.tsx"),
    "./src/features/product-detail/components/offer-details.stories.tsx": require("../src/features/product-detail/components/offer-details.stories.tsx"),
    "./src/features/product-detail/components/offer-selection-filter/offer-selection-filter-suggestions-item.stories.tsx": require("../src/features/product-detail/components/offer-selection-filter/offer-selection-filter-suggestions-item.stories.tsx"),
    "./src/features/product-detail/components/product-detail-footer.stories.tsx": require("../src/features/product-detail/components/product-detail-footer.stories.tsx"),
    "./src/features/product-detail/components/product-report-body.stories.tsx": require("../src/features/product-detail/components/product-report-body.stories.tsx"),
    "./src/features/product-detail/stories/offer-selection-screen.stories.tsx": require("../src/features/product-detail/stories/offer-selection-screen.stories.tsx"),
    "./src/features/product-detail/stories/product-detail-screen.stories.tsx": require("../src/features/product-detail/stories/product-detail-screen.stories.tsx"),
    "./src/features/profile/components/update-profile-alert.stories.tsx": require("../src/features/profile/components/update-profile-alert.stories.tsx"),
    "./src/features/reservations/components/reservation-detail-footer.stories.tsx": require("../src/features/reservations/components/reservation-detail-footer.stories.tsx"),
    "./src/features/reservations/components/reservation-detail-header.stories.tsx": require("../src/features/reservations/components/reservation-detail-header.stories.tsx"),
    "./src/features/reservations/stories/reservations-list-empty.stories.tsx": require("../src/features/reservations/stories/reservations-list-empty.stories.tsx"),
    "./src/features/reservations/stories/reservations-list-item.stories.tsx": require("../src/features/reservations/stories/reservations-list-item.stories.tsx"),
    "./src/features/spartacus-webview/components/webview-error-view.stories.tsx": require("../src/features/spartacus-webview/components/webview-error-view.stories.tsx"),
    "./src/features/spartacus-webview/components/webview-loading-indicator.stories.tsx": require("../src/features/spartacus-webview/components/webview-loading-indicator.stories.tsx"),
    "./src/screens/app/onboarding/onboarding-notification-permission-screen.stories.tsx": require("../src/screens/app/onboarding/onboarding-notification-permission-screen.stories.tsx"),
    "./src/screens/app/release-notes-modal-screen.stories.tsx": require("../src/screens/app/release-notes-modal-screen.stories.tsx"),
    "./src/screens/app/release-notes-screen.stories.tsx": require("../src/screens/app/release-notes-screen.stories.tsx"),
    "./src/screens/product-details/product-confirm-reservation-screen.stories.tsx": require("../src/screens/product-details/product-confirm-reservation-screen.stories.tsx"),
    "./src/screens/reservations/report-screen.stories.tsx": require("../src/screens/reservations/report-screen.stories.tsx"),
    "./src/screens/reservations/reservation-detail-screen-pickup.stories.tsx": require("../src/screens/reservations/reservation-detail-screen-pickup.stories.tsx"),
    "./src/screens/reservations/reservation-detail-screen.stories.tsx": require("../src/screens/reservations/reservation-detail-screen.stories.tsx"),
    "./src/theme/typography.stories.tsx": require("../src/theme/typography.stories.tsx"),
  };
};

configure(getStories, module, false);
