#!/bin/bash

# receive target db2 table owner as first cli param (WSDIWNC, WSDIWWC, WSDIWEC, WSDIWC)
TABLE_OWNER=$1

# receive target table dirname as second cli param (WSWTUMC, WBMTCHCN, WHBTZI1, WHBTT40, WHMTZK0, WSRTZ04, WSWTRL0, WSWTRL8, WBMTCHCC, WBMTCHBL)
TABLE_NAME=$2

# container name pattern to get, used to fetch CONTAINER_ID
CONTAINER_NAME_PATTERN=$3

# path to created table full csv data file
CSV_PATH=/tools/ldw/data-files/${TABLE_NAME}/${TABLE_NAME}.csv

# CONTAINER_NAME_PATTERN used to fetch CONTAINER_ID
CONTAINER_ID=$(docker ps -q --filter="name=${CONTAINER_NAME_PATTERN}")

# join all files data into TABLE_FULL_CSV
sed '' /tools/ldw/data-files/${TABLE_NAME}/*.txt > ${CSV_PATH}

# remove all .txt files from TABLE_NAME dir
# if [ `echo $? == 0` ]; then rm /tools/ldw/data-files/${TABLE_NAME}/${TABLE_NAME}*.txt; fi;

# load table data into docker DB2
docker exec ${CONTAINER_ID} bash -c "/database/config/ldwgrp/sqllib/bin/db2 connect to SDULDWDB && /database/config/ldwgrp/sqllib/bin/db2 'LOAD FROM /database/ldw-data/WSWTUMC/${TABLE_NAME}.csv OF DEL REPLACE INTO ${TABLE_OWNER}.${TABLE_NAME} NONRECOVERABLE' > ${TABLE_NAME}.txt 2>&1"

# remove all .csv files from TABLE_NAME dir
# if [ `echo $? == 0` ]; then rm /tools/ldw/data-files/${TABLE_NAME}/${TABLE_NAME}*.csv; fi;
