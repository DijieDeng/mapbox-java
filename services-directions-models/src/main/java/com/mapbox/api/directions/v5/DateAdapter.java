package com.mapbox.api.directions.v5;

import com.google.gson.TypeAdapter;
import com.google.gson.stream.JsonReader;
import com.google.gson.stream.JsonWriter;
import com.mapbox.api.directions.v5.utils.FormatUtils;
import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.TimeZone;

/**
 * Date adapter to serialize/deserialize specific ISO 8601 date format.
 */
public class DateAdapter extends TypeAdapter<Date> {

  @Override
  public void write(JsonWriter out, Date value) throws IOException {
    out.value(FormatUtils.formatDateToIso8601DateTime(value));
  }

  @Override
  public Date read(JsonReader in) throws IOException {
    try {
      SimpleDateFormat sdf = new SimpleDateFormat(FormatUtils.ISO_8601_PATTERN);
      // dates are sent with local date/time -> no need UTC offset for serialize/deserialize
      sdf.setTimeZone(TimeZone.getTimeZone("UTC"));
      return sdf.parse(in.nextString());
    } catch (ParseException exception) {
      return null;
    }
  }
}
