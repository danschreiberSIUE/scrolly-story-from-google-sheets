// Defines all the data needed for a step

export class ScrollyData {
  constructor(storyData, stepData) {
    this.storyData = storyData;
    this.stepData = stepData;
  }
}

export class StoryData {
  constructor(scrollType, title, subtitle, endText, footer) {
    this.scrollType = scrollType;
    this.title = title;
    this.subtitle = subtitle;
    this.endText = endText;
    this.footer = footer;
  }
}
export class StepData {
  constructor(
    contentType,
    filePath,
    altText,
    latitude,
    longitude,
    zoomLevel,
    text
  ) {
    this.contentType = contentType;
    this.filePath = filePath;
    this.altText = altText;
    this.latitude = latitude;
    this.longitude = longitude;
    this.zoomLevel = zoomLevel;
    this.text = text;
  }

  validate(actionTextIfError) {
    const validContentTypes = ["image", "map"];
    if (!validContentTypes.includes(this.contentType)) {
      throw new ScrollyError(
        actionTextIfError,
        `Invalid contentType: "${this.contentType}"`,
        `Valid contentType values are: ${validContentTypes.join(", ")}`
      );
    }

    if (!this.altText || this.altText.length === 0) {
      throw new ScrollyError(
        actionTextIfError,
        `AltText is a required field`,
        `Accessiblity requires AltText to be set for all content`
      );
    }

    if (
      this.contentType === "map" &&
      (this.latitude < -90.0 || this.latitude > 90.0)
    ) {
      throw new ScrollyError(
        actionTextIfError,
        'Latitude must be between -90.0 and 90.0 for content type "map"'
      );
    }
    if (
      this.contentType === "map" &&
      (this.longitude < -180.0 || this.longitude > 180.0)
    ) {
      throw new ScrollyError(
        actionTextIfError,
        'Longitude must be between -180.0 and 180.0 for content type "map"'
      );
    }

    if (this.zoomLevel != null && isNaN(Number(this.zoomLevel))) {
      throw new ScrollyError(
        actionTextIfError,
        `ZoomLevel of ${this.zoomLevel} is invalid`,
        "ZoomLevel must be a number"
      );
    }
  }
}

export function validateStepDataArray(stepDataArray, actionTextIfError) {
  var step = 1;
  stepDataArray.forEach((stepData) => {
    stepData.validate(actionTextIfError + ", step " + step);
    step++;
  });
}

export class ScrollyError extends Error {
  constructor(Action, Message, Hint) {
    super(Message);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ScrollyError);
    }
    // use Error.message for the error message
    this.action = Action;
    this.hint = Hint;
  }
}
