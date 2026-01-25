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
import io, base64
from django.conf import settings
from sklearn.preprocessing import MinMaxScaler
from keras.models import load_model
from sklearn.metrics import mean_squared_error, r2_score

class StockPredictionAPIView(APIView):
    def _plot_to_base64(self, fig):
        buf = io.BytesIO()
        fig.savefig(buf, format="png", bbox_inches="tight")
        plt.close(fig)
        buf.seek(0)
        return base64.b64encode(buf.read()).decode("utf-8")

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
            fig1 = plt.figure(figsize=(14,7))
            plt.plot(df['Close'], label='Close Price')
            plt.title(F'{ticker.upper()} Stock Price Over the Last 10 Years (Trading Days)')
            plt.xlabel('Days')
            plt.ylabel('Price (USD)')        
            plt.xticks(list(range(0, len(df), 200)) + [len(df)-1])
            plt.legend()
            plot_img = self._plot_to_base64(fig1)

            # 100 days moving average
            ma100 = df['Close'].rolling(100).mean()
            plt.switch_backend('Agg')  # Use a non-interactive backend
            fig2 = plt.figure(figsize=(14,7))
            plt.plot(df['Close'], label='Close Price')
            plt.plot(ma100, 'r', label='100-Day Moving Average')
            plt.title(F'100-Day Moving Average {ticker.upper()} Stock Price Over the Last 10 Years (Trading Days)')
            plt.xlabel('Days')
            plt.ylabel('Price (USD)')
            plt.xticks(list(range(0, len(df), 200)) + [len(df)-1])
            plt.legend()
            plot_100_dma = self._plot_to_base64(fig2)

            # 200 days moving average
            ma200 = df['Close'].rolling(200).mean()
            plt.switch_backend('Agg')  # Use a non-interactive backend
            fig2 = plt.figure(figsize=(14,7))
            plt.plot(df['Close'], label='Close Price')
            plt.plot(ma100, 'r', label='100-Day Moving Average')
            plt.plot(ma200, 'g', label='200-Day Moving Average')
            plt.title(F'200-Day Moving Average {ticker.upper()} Stock Price Over the Last 10 Years (Trading Days)')
            plt.xlabel('Days')
            plt.ylabel('Price (USD)')
            plt.xticks(list(range(0, len(df), 200)) + [len(df)-1])
            plt.legend()
            plot_200_dma = self._plot_to_base64(fig2)

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
            plt.switch_backend('Agg')  # Use a non-interactive backend
            fig3 = plt.figure(figsize=(14,7))
            plt.plot(y_test, 'b', label='Original Close Price')
            plt.plot(y_predicted, 'r', label='Predicted Close Price')
            plt.title(F'Predicted vs Original {ticker.upper()} Stock Price Prediction – Test Set Performance (Last 30% of Data)')
            plt.xlabel('Days')
            plt.ylabel('Price (USD)')

            train_len = int(len(df) * 0.70)
            start_index = train_len
            ticks_pos = list(range(0, len(y_test), 100)) + [len(y_test)-1]
            ticks_labels = [str(start_index + t) for t in ticks_pos]
            plt.xticks(ticks_pos, ticks_labels)

            plt.legend()
            plot_pred_vs_orig = self._plot_to_base64(fig3)
            
            # Modal evaluation
            # Mean Squared Error (MSE)
            mse = mean_squared_error(y_test, y_predicted)

            # Root Mean Squared Error (RMSE)
            rmse = np.sqrt(mse)

            # R-squared (R2) Score
            r2 = r2_score(y_test, y_predicted)

            

            return Response({   
                "ticker": ticker.upper(),
                "plot_image": plot_img,
                "plot_100_dma": plot_100_dma,
                "plot_200_dma": plot_200_dma,
                "plot_pred_vs_orig": plot_pred_vs_orig,
                "mse": mse,
                "rmse": rmse,
                "r2": r2,
            }, status=status.HTTP_200_OK)