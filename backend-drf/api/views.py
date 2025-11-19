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
import os
from django.conf import settings
from .utils import save_plot

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

            if df.empty:
                return Response({"error": "Invalid ticker or no data found."}, status=status.HTTP_400_BAD_REQUEST)
            
            df = df.reset_index()

            # Generate Basic Plot
            plt.switch_backend('Agg')  # Use a non-interactive backend
            plt.figure(figsize=(14,7))
            plt.plot(df['Date'], df['Close'], label='Close Price')
            plt.title(F'{ticker.upper()} Stock Price Over Time')
            plt.xlabel('Date')
            plt.ylabel('Price (USD)')
            plt.legend()
            plt.show()
            # Save plot to a file
            plot_filename = f'{ticker.upper()}_plot.png'
            plot_img = save_plot(plot_filename)

            # 100 days moving average
            ma100 = df['Close'].rolling(100).mean()
            plt.switch_backend('Agg')  # Use a non-interactive backend
            plt.figure(figsize=(14,7))
            plt.plot(df['Date'], df['Close'], label='Close Price')
            plt.plot(df['Date'], ma100, 'r', label='100-Day Moving Average')
            plt.title(F'{ticker.upper()} Stock Price Over Time')
            plt.xlabel('Date')
            plt.ylabel('Price (USD)')
            plt.legend()
            plt.show()
            # Save plot to a file
            plot_filename_100_dma = f'{ticker.upper()}_100_dma.png'
            plot_100_dma = save_plot(plot_filename_100_dma)

            return Response({   
                "ticker": ticker.upper(),
                "plot_image": plot_img,
                "plot_100_dma": plot_100_dma,
            }, status=status.HTTP_200_OK)