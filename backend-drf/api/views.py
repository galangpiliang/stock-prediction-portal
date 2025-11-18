from django.shortcuts import render
from rest_framework.views import APIView
from .serializers import StockPredictionSerializer
from rest_framework.response import Response
from rest_framework import status
import yfinance as yf
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from datetime import datetime

class StockPredictionAPIView(APIView):
    def post(self, request):
        serializer = StockPredictionSerializer(data=request.data)
        if serializer.is_valid():
            ticker = serializer.validated_data['ticker']

            # Fetch data from Yahoo Finance
            now = datetime.now()
            start = datetime(now.year-10, now.month, now.day)
            df = yf.download(ticker, start, end=now)
            df.columns = df.columns.get_level_values(0)
            print(df.head())

            if df.empty:
                return Response({"error": "Invalid ticker or no data found."}, status=status.HTTP_400_BAD_REQUEST)

            return Response({"message": f"Received ticker: {ticker}"}, status=status.HTTP_200_OK)
        