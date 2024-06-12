// Command dl downloads audio files from 立法院. It saves the audio files in the following structure:
//
//	146931
//	  video.mp4
//	  audio.wav
//	146941
//	  video.mp4
//	  audio.wav
//	...
package main

import (
	"bytes"
	"encoding/csv"
	"flag"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"os/exec"
	"path"
	"path/filepath"
	"strings"

	"github.com/pkg/errors"
)

func download(outDir, url1M string) error {
	urlStr := strings.Replace(url1M, "1M", "300K", 1)
	id := path.Base(urlStr)
	dir := filepath.Join(outDir, id)
	if err := os.MkdirAll(dir, os.ModePerm); err != nil {
		return errors.Wrap(err, "")
	}

	webpage, err := getHTTP(urlStr)
	if err != nil {
		return errors.Wrap(err, "")
	}
	m3u8URL, err := extract(webpage)
	if err != nil {
		return errors.Wrap(err, fmt.Sprintf("%s", webpage))
	}

	vidPath := filepath.Join(dir, "video.mp4")
	if err := ffmpegDL(vidPath, m3u8URL); err != nil {
		return errors.Wrap(err, fmt.Sprintf("%#v", m3u8URL))
	}
	audioPath := filepath.Join(dir, "audio.wav")
	if err := getAudio(audioPath, vidPath); err != nil {
		return errors.Wrap(err, "")
	}

	return nil
}

func getAudio(outPath, vidPath string) error {
	stdoutStderr, err := exec.Command("ffmpeg", "-i", vidPath, "-vn", "-ar", "16000", "-af", "pan=mono|FC=FR", outPath).CombinedOutput()
	if err != nil {
		return errors.Wrap(err, fmt.Sprintf("%s", stdoutStderr))
	}
	return nil
}

func ffmpegDL(outPath, urlStr string) error {
	stdoutStderr, err := exec.Command("ffmpeg", "-i", urlStr, outPath).CombinedOutput()
	if err != nil {
		return errors.Wrap(err, fmt.Sprintf("%s", stdoutStderr))
	}
	return nil
}

func extract(body []byte) (string, error) {
	readyPlayerStr := `readyPlayer("`
	start := bytes.Index(body, []byte(readyPlayerStr))
	if start == -1 {
		return "", errors.Errorf("no start")
	}
	end := bytes.Index(body[start:], []byte(`",`))
	if end == -1 {
		return "", errors.Errorf("no end")
	}
	return string(body[start+len(readyPlayerStr) : start+end]), nil
}

func getHTTP(urlStr string) ([]byte, error) {
	req, err := http.NewRequest("GET", urlStr, nil)
	if err != nil {
		return nil, errors.Wrap(err, "")
	}
	req.Header.Set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36 Edg/121.0.0.0")
	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, errors.Wrap(err, "")
	}
	defer resp.Body.Close()
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, errors.Wrap(err, "")
	}
	return body, nil
}

func getURLs() ([]string, error) {
	fpath := `148_CSV_148_1008CSV-1.csv`
	content, err := os.ReadFile(fpath)
	if err != nil {
		return nil, errors.Wrap(err, "")
	}
	rows, err := csv.NewReader(bytes.NewBuffer(content)).ReadAll()
	if err != nil {
		return nil, errors.Wrap(err, "")
	}

	// Skip header
	rows = rows[1:]

	urls := make([]string, 0, len(rows))
	for _, row := range rows {
		urls = append(urls, row[13])
	}

	return urls, nil
}

func main() {
	flag.Parse()
	log.SetFlags(log.LstdFlags | log.Lmicroseconds | log.Llongfile)
	if err := mainWithErr(); err != nil {
		log.Fatalf("%+v", err)
	}
}

func mainWithErr() error {
	urls, err := getURLs()
	if err != nil {
		return errors.Wrap(err, "")
	}

	urls = urls[:20]

	outDir := "data"
	for _, urlStr := range urls {
		if err := download(outDir, urlStr); err != nil {
			return errors.Wrap(err, fmt.Sprintf("%#v", urlStr))
		}
	}

	return nil
}
