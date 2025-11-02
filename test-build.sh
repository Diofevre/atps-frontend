npm run build 2>&1 | tee build.log
if [ ${PIPESTATUS[0]} -eq 0 ]; then
  echo "Build succeeded"
else
  echo "Build failed, checking for timeouts..."
  grep -c "timing out" build.log || echo "No timeout found"
fi
