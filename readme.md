# Computes Sentiment Analysis Algorithm

The Lattice I/O model is: receive input as JSON via stdin, print json to stdout

Building the docker image: https://nodejs.org/en/docs/guides/nodejs-docker-webapp/

## Tip: Test by running Docker in interactive mode

echo "i love skynet" | docker run -i computes/computes-sentiment:latest

## Computes Automated Bash Script
```
#!/bin/bash
# https://github.com/computes/help/wiki/First-Task

function poll {
  pollResults=`cat result-dataset.hash | computes-cli dataset dumplatest`
  if [[ $pollResults = '{"uuid":"'* ]]; then
    echo "Computing ... $pollResults"
    sleep 1
    poll
  else
    echo $pollResults | jq
  fi
}

echo "Get ready to experience awesomeness!"
echo ""
echo "> creating result-dataset"
computes-cli dataset create --generate-uuid > result-dataset.hash
results=`cat result-dataset.hash`
echo $results

echo "> creating split-status"
computes-cli dataset create --generate-uuid > split-status.hash
status=`cat split-status.hash`
echo $status

echo ""
echo "> creating split-task.json"
FILE="./split-task-auto.json"

/bin/cat <<EOM >$FILE
{
  "input": {
    "dataset": "i love skynet"
  },
  "taskDefinition": {
    "runner": {
      "type": "docker-json-runner",
      "metadata": {
        "image": "computes/computes-sentiment:latest"
      }
    },
    "result": {
      "action": "set",
      "destination": {
        "dataset": { "/": "$results" },
        "path": "split/results"
      }
    }
  },
  "status": {
    "/": "$status"
  }
}
EOM
echo `cat split-task-auto.json`

echo ""
echo "> adding task to Computes FS"
echo "cat split-task-auto.json | ipfs dag put > split-task.hash"
cat split-task-auto.json | ipfs dag put > split-task.hash
echo "added"

echo "> adding task to Lattice"
echo "cat split-task.hash | computes-cli task enqueue"
cat split-task.hash | computes-cli task enqueue

echo ""
echo "> checking status of queues"
echo "computes-cli queue dump | jq"
computes-cli queue dump | jq

echo ""
echo "> checking for results"
echo "cat result-dataset.hash | computes-cli dataset dumplatest"
# sleep 5
poll

echo ""
echo "Congratulations! You have just run your first decentralized compute!"
```
