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
from sklearn.preprocessing import MinMaxScaler
from keras.models import load_model

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
            plt.title(F'100-Day Moving Average {ticker.upper()} Stock Price Over Time')
            plt.xlabel('Date')
            plt.ylabel('Price (USD)')
            plt.legend()
            plt.show()
            # Save plot to a file
            plot_filename_100_dma = f'{ticker.upper()}_100_dma.png'
            plot_100_dma = save_plot(plot_filename_100_dma)

            # 200 days moving average
            ma200 = df['Close'].rolling(200).mean()
            plt.switch_backend('Agg')  # Use a non-interactive backend
            plt.figure(figsize=(14,7))
            plt.plot(df['Date'], df['Close'], label='Close Price')
            plt.plot(df['Date'], ma100, 'r', label='100-Day Moving Average')
            plt.plot(df['Date'], ma200, 'g', label='200-Day Moving Average')
            plt.title(F'200-Day Moving Average {ticker.upper()} Stock Price Over Time')
            plt.xlabel('Date')
            plt.ylabel('Price (USD)')
            plt.legend()
            plt.show()
            # Save plot to a file
            plot_filename_200_dma = f'{ticker.upper()}_200_dma.png'
            plot_200_dma = save_plot(plot_filename_200_dma)

            # Splitting data into training and testing sets
            data_training = pd.DataFrame(df['Close'][0:int(len(df)*0.70)])
            data_testing = pd.DataFrame(df['Close'][int(len(df)*0.70): int(len(df))])  

            # Sclaing down the data between 0 and 1
            scaler = MinMaxScaler(feature_range=(0,1))
            data_training_array = scaler.fit_transform(data_training)

            # Load the pre-trained model
            model = load_model('stock_prediction_model.keras')

            # Preparing testing data
            past_100_days = data_training.tail(100)
            final_df = pd.concat([past_100_days, data_testing], ignore_index=True)
            input_data = scaler.transform(final_df)
            
            x_test = []
            y_test = []
            for i in range(100, input_data.shape[0]):
                x_test.append(input_data[i-100:i])
                y_test.append(input_data[i, 0])
            x_test, y_test = np.array(x_test), np.array(y_test)

            # Making predictions
            y_predicted = model.predict(x_test)
            
            # Revert the scaled prices back to original price
            y_predicted = scaler.inverse_transform(y_predicted.reshape(-1, 1)).flatten()
            y_test = scaler.inverse_transform(y_test.reshape(-1, 1)).flatten()

            print("Y Test:", y_test)
            print("Y Predicted:", y_predicted)

            # Plot the final prediction


            return Response({   
                "ticker": ticker.upper(),
                "plot_image": plot_img,
                "plot_100_dma": plot_100_dma,
                "plot_200_dma": plot_200_dma,
            }, status=status.HTTP_200_OK)