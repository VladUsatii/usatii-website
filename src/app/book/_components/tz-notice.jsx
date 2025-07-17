function TZNotice() {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return (
      <p className="text-xs text-center text-muted-foreground mb-5">
        Times shown in <strong>{tz.replace('_',' ')}</strong>
      </p>
    );
  }

export default TZNotice